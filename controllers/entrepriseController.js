const Entreprise = require('../models/entreprise.model');
const User = require('../models/user.model');

// - Créer une entreprise
exports.createEntreprise = async (req, res) => {
    try {
        const { name, email, secteur } = req.body;
        
        // Vérifier si l'email existe déjà
        const entrepriseExiste = await Entreprise.findOne({ email });
        if (entrepriseExiste) {
            return res.status(400).json({ 
                success: false,
                message: 'Email d\'entreprise déjà utilisé' 
            });
        }
        
        const entreprise = await Entreprise.create({
            name,
            email,
            secteur
        });
        
        res.status(201).json({
            success: true,
            message: 'Entreprise créée avec succès',
            entreprise
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

//Obtenir toutes les entreprises
exports.getAllEntreprises = async (req, res) => {
    try {
        const entreprises = await Entreprise.find();
        
        res.json({
            success: true,
            count: entreprises.length,
            entreprises
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

//  Obtenir une entreprise par ID
exports.getEntrepriseById = async (req, res) => {
    try {
        const entreprise = await Entreprise.findById(req.params.id);
        
        if (!entreprise) {
            return res.status(404).json({ 
                success: false,
                message: 'Entreprise non trouvée' 
            });
        }
        
        res.json({
            success: true,
            entreprise
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Mettre à jour une entreprise
exports.updateEntreprise = async (req, res) => {
    try {
        const { name, email, secteur } = req.body;
        
        // Si l'email change, vérifier qu'il n'est pas déjà utilisé
        if (email) {
            const entrepriseExiste = await Entreprise.findOne({ 
                email, 
                _id: { $ne: req.params.id } 
            });
            
            if (entrepriseExiste) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Email déjà utilisé' 
                });
            }
        }
        
        const entreprise = await Entreprise.findByIdAndUpdate(
            req.params.id,
            { name, email, secteur },
            { new: true, runValidators: true }
        );
        
        if (!entreprise) {
            return res.status(404).json({ 
                success: false,
                message: 'Entreprise non trouvée' 
            });
        }
        
        res.json({
            success: true,
            message: 'Entreprise mise à jour avec succès',
            entreprise
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

//  Supprimer une entreprise (et ses RH/Employees)
exports.deleteEntreprise = async (req, res) => {
    try {
        const entreprise = await Entreprise.findByIdAndDelete(req.params.id);
        
        if (!entreprise) {
            return res.status(404).json({ 
                success: false,
                message: 'Entreprise non trouvée' 
            });
        }
        
        // Supprimer tous les utilisateurs liés à cette entreprise
        await User.deleteMany({ entrepriseId: req.params.id });
        
        res.json({
            success: true,
            message: 'Entreprise et utilisateurs associés supprimés avec succès',
            entreprise: {
                id: entreprise._id,
                name: entreprise.name,
                email: entreprise.email
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Obtenir les employés d'une entreprise
exports.getEntrepriseEmployees = async (req, res) => {
    try {
        const employees = await User.find({ 
            entrepriseId: req.params.id,
            role: { $in: ['RH', 'employee'] }
        }).select('-password');
        
        res.json({
            success: true,
            count: employees.length,
            employees
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};