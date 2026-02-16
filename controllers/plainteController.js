const Plainte = require('../models/plainte.model');
const User = require('../models/user.model');

exports.createPlainte = async (req, res) => {
    try {
        const { employeId, sujet, message } = req.body;
        
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
        
        const plainte = await Plainte.create({
            employeId,
            sujet,
            message,
            statut: 'EN_ATTENTE'
        });
        
        await plainte.populate('employeId', 'nom email departement');
        
        res.status(201).json({
            success: true,
            message: 'Plainte envoyée avec succès',
            plainte
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.getAllPlaintes = async (req, res) => {
    try {
        const plaintes = await Plainte.find()
            .populate('employeId', 'nom email departement entrepriseId')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: plaintes.length,
            plaintes
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.getPlainteById = async (req, res) => {
    try {
        const plainte = await Plainte.findById(req.params.id)
            .populate('employeId', 'nom email departement');
        
        if (!plainte) {
            return res.status(404).json({ 
                success: false,
                message: 'Plainte non trouvée' 
            });
        }
        
        res.json({
            success: true,
            plainte
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.updatePlainte = async (req, res) => {
    try {
        const { reponse, statut } = req.body;
        
        const updateData = {};
        
        if (reponse) {
            updateData.reponse = reponse;
            updateData.statut = 'TRAITEE';
        }
        
        if (statut) {
            updateData.statut = statut;
        }
        
        const plainte = await Plainte.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('employeId', 'nom email departement');
        
        if (!plainte) {
            return res.status(404).json({ 
                success: false,
                message: 'Plainte non trouvée' 
            });
        }
        
        res.json({
            success: true,
            message: 'Plainte mise à jour avec succès',
            plainte
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.deletePlainte = async (req, res) => {
    try {
        const plainte = await Plainte.findByIdAndDelete(req.params.id);
        
        if (!plainte) {
            return res.status(404).json({ 
                success: false,
                message: 'Plainte non trouvée' 
            });
        }
        
        res.json({
            success: true,
            message: 'Plainte supprimée avec succès',
            plainte: {
                id: plainte._id,
                sujet: plainte.sujet
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.getPlaintesByEmploye = async (req, res) => {
    try {
        const plaintes = await Plainte.find({ employeId: req.params.employeId })
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: plaintes.length,
            plaintes
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

exports.getPlaintesByStatut = async (req, res) => {
    try {
        const { statut } = req.params;
        
        const plaintes = await Plainte.find({ statut })
            .populate('employeId', 'nom email departement')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            statut,
            count: plaintes.length,
            plaintes
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};