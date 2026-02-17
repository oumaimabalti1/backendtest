const Conge = require('../models/conge.model');
const Plainte = require('../models/plainte.model');

// ════════════════════════════════════════════════════
// GESTION DES CONGÉS
// ════════════════════════════════════════════════════

// ✅ Demander un congé
exports.demanderConge = async (req, res) => {
    try {
        const { dateDebut, dateFin } = req.body;
        
        // Vérifier que dateDebut < dateFin
        if (new Date(dateDebut) >= new Date(dateFin)) {
            return res.status(400).json({ 
                success: false,
                message: 'La date de début doit être antérieure à la date de fin' 
            });
        }
        
        const conge = await Conge.create({
            employeId: req.user.id,  // ← ID de l'employé connecté
            dateDebut,
            dateFin,
            statut: 'EN_ATTENTE'
        });
        
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

// ✅ Voir mes congés
exports.getMesConges = async (req, res) => {
    try {
        const conges = await Conge.find({ 
            employeId: req.user.id  // ← Seulement MES congés
        }).sort({ createdAt: -1 });
        
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

// ✅ Annuler un congé (si EN_ATTENTE)
exports.annulerConge = async (req, res) => {
    try {
        const conge = await Conge.findOne({
            _id: req.params.id,
            employeId: req.user.id  // ← Vérifier que c'est bien MON congé
        });
        
        if (!conge) {
            return res.status(404).json({ 
                success: false,
                message: 'Congé non trouvé' 
            });
        }
        
        // On peut annuler seulement si EN_ATTENTE
        if (conge.statut !== 'EN_ATTENTE') {
            return res.status(400).json({ 
                success: false,
                message: 'Vous ne pouvez annuler qu\'un congé en attente' 
            });
        }
        
        await Conge.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Congé annulé avec succès'
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ════════════════════════════════════════════════════
// GESTION DES PLAINTES
// ════════════════════════════════════════════════════

// ✅ Envoyer une plainte
exports.envoyerPlainte = async (req, res) => {
    try {
        const { sujet, message } = req.body;
        
        const plainte = await Plainte.create({
            employeId: req.user.id,  // ← ID de l'employé connecté
            sujet,
            message,
            statut: 'EN_ATTENTE'
        });
        
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

// ✅ Voir mes plaintes
exports.getMesPlaintes = async (req, res) => {
    try {
        const plaintes = await Plainte.find({ 
            employeId: req.user.id  // ← Seulement MES plaintes
        }).sort({ createdAt: -1 });
        
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

// ✅ Voir une plainte spécifique (avec la réponse)
exports.getPlainteById = async (req, res) => {
    try {
        const plainte = await Plainte.findOne({
            _id: req.params.id,
            employeId: req.user.id  // ← Vérifier que c'est MA plainte
        });
        
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