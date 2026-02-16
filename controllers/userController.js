const User = require('../models/user.model');

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, departement, entrepriseId } = req.body;
        
        //verifie l mail si mawjoud 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email deja utilisé' });
        }

        //ajout user 
         const user = await User.create({ name, email, password, role,  entrepriseId, departement });

              res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                id: user._id,
                nom: user.name,
                email: user.email,
                role: user.role,
                entrepriseId: user.entrepriseId,
                departement: user.departement
            }
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .populate('entrepriseId')
            .select('-password');  
        
        res.json({
            count: users.length,
            users
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get user by id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('entrepriseId')
            .select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        res.json(user);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//update user
exports.updateUser = async (req, res) => {
    try {
        const { name, email, role, entrepriseId, departement } = req.body;

        // Vérifier si email déjà utilisé par autre user
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(400).json({ message: "Email déjà utilisé" });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role, entrepriseId, departement },
            { returnDocument: 'after', runValidators: true }
        )
        .populate('entrepriseId')
        .select('-password');

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({
            message: 'Utilisateur mis à jour avec succès',
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        res.json({
            message: 'Utilisateur supprimé avec succès',
            user: {
                id: user._id,
                nom: user.name,
                email: user.email
            }
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        
        const users = await User.find({ role })
            .populate('entrepriseId')
            .select('-password');  // ← إخفاء كلمة المرور
        
        res.json({
            role,
            count: users.length,
            users
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};