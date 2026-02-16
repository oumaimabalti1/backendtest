const Conge = require('../models/conge.model');
const User = require('../models/user.model');

// ✅ CREATE - Demander un congé
exports.createConge = async (req, res) => {
    try {
        const { employeId, dateDebut, dateFin } = req.body;
        
        // Vérifier que l'employé existe
        const employe = await User.findOne({ 
            _id: employeId, 
            role: { $in: ['employee', 'RH'] }
        });
        
        if (!employe) {
            return res.status(404).json({ 
                success: false,
                message: 'Employé non trouvé' 
            });
        }
        
        // Vérifier que dateDebut < dateFin
        if (new Date(dateDebut) >= new Date(dateFin)) {
            return res.status(400).json({ 
                success: false,
                message: 'La date de début doit être antérieure à la date de fin' 
            });
        }
        
        const conge = await Conge.create({
            employeId,
            dateDebut,
            dateFin,
            statut: 'EN_ATTENTE'
        });
        
        await conge.populate('employeId', 'nom email departement');
        
        res.status(201).json({
            success: true,
            message: 'Demande de congé envoyée avec succès',
            conge
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ READ - Obtenir tous les congés
exports.getAllConges = async (req, res) => {
    try {
        const conges = await Conge.find()
            .populate('employeId', 'nom email departement entrepriseId')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: conges.length,
            conges
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ READ - Obtenir un congé par ID
exports.getCongeById = async (req, res) => {
    try {
        const conge = await Conge.findById(req.params.id)
            .populate('employeId', 'nom email departement');
        
        if (!conge) {
            return res.status(404).json({ 
                success: false,
                message: 'Congé non trouvé' 
            });
        }
        
        res.json({
            success: true,
            conge
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ UPDATE - Mettre à jour le statut d'un congé
exports.updateCongeStatut = async (req, res) => {
    try {
        const { statut } = req.body;
        
        if (!['EN_ATTENTE', 'APPROUVE', 'REFUSE'].includes(statut)) {
            return res.status(400).json({ 
                success: false,
                message: 'Statut invalide. Utilisez: EN_ATTENTE, APPROUVE ou REFUSE' 
            });
        }
        
        const conge = await Conge.findByIdAndUpdate(
            req.params.id,
            { statut },
            { new: true, runValidators: true }
        ).populate('employeId', 'nom email departement');
        
        if (!conge) {
            return res.status(404).json({ 
                success: false,
                message: 'Congé non trouvé' 
            });
        }
        
        res.json({
            success: true,
            message: `Congé ${statut === 'APPROUVE' ? 'approuvé' : statut === 'REFUSE' ? 'refusé' : 'mis à jour'}`,
            conge
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ DELETE - Supprimer un congé
exports.deleteConge = async (req, res) => {
    try {
        const conge = await Conge.findByIdAndDelete(req.params.id);
        
        if (!conge) {
            return res.status(404).json({ 
                success: false,
                message: 'Congé non trouvé' 
            });
        }
        
        res.json({
            success: true,
            message: 'Congé supprimé avec succès',
            conge: {
                id: conge._id
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ BONUS - Obtenir les congés d'un employé
exports.getCongesByEmploye = async (req, res) => {
    try {
        const conges = await Conge.find({ employeId: req.params.employeId })
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: conges.length,
            conges
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ BONUS - Obtenir les congés par statut
exports.getCongesByStatut = async (req, res) => {
    try {
        const { statut } = req.params;
        
        const conges = await Conge.find({ statut })
            .populate('employeId', 'nom email departement')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            statut,
            count: conges.length,
            conges
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};