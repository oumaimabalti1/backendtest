const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//  Inscription (Candidat uniquement)
exports.register = async (req, res) => {
    try {
        const { nom, email, password } = req.body;
        
        const userExiste = await User.findOne({ email });
        if (userExiste) {
            return res.status(400).json({ 
                success: false,
                message: 'Email déjà utilisé' 
            });
        }
        
        const user = await User.create({
            nom,
            email,
            password,
            role: 'candidat'
        });
        
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            success: true,
            message: 'Compte créé avec succès',
            token,
            user: {
                id: user._id,
                nom: user.nom,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Connexion (TOUS les users)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Email ou mot de passe incorrect' 
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Email ou mot de passe incorrect' 
            });
        }
        
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            message: 'Connexion réussie',
            token,
            user: {
                id: user._id,
                nom: user.nom,
                email: user.email,
                role: user.role,
                entrepriseId: user.entrepriseId,
                departement: user.departement
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Mon profil
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('entrepriseId', 'nom email secteur')
            .select('password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'Utilisateur non trouvé' 
            });
        }
        
        res.json({
            success: true,
            user
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Modifier profil
exports.updateProfile = async (req, res) => {
    try {
        const { nom, email } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { nom, email },
            { new: true, runValidators: true }
        )
            .populate('entrepriseId', 'nom email secteur')
            .select('password');
        
        res.json({
            success: true,
            message: 'Profil mis à jour avec succès',
            user
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    try {
        const { oldpassword, newpassword } = req.body;
        
        const user = await User.findById(req.user.id);
        
        const isMatch = await bcrypt.compare(oldpassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Ancien mot de passe incorrect' 
            });
        }
        
        user.password = newpassword;
        await user.save();
        
        res.json({
            success: true,
            message: 'Mot de passe changé avec succès'
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};