const Candidature = require('../models/candidature.model');
const Offre = require('../models/offre.model');
const User = require('../models/user.model');

// Créer une candidature
exports.createCandidature = async (req, res) => {
    try {
        const { candidatId, offreId, scoreIA } = req.body;
        
        // Vérifier que le candidat existe
        const candidat = await User.findOne({ _id: candidatId, role: 'candidat' });
        if (!candidat) {
            return res.status(404).json({ 
                success: false,
                message: 'Candidat non trouvé' 
            });
        }
        
        // Vérifier que l'offre existe
        const offre = await Offre.findById(offreId);
        if (!offre) {
            return res.status(404).json({  success: false, message: 'Offre non trouvée' 
            });
        }
        
        // Vérifier si le candidat a déjà postulé à cette offre
        const candidatureExiste = await Candidature.findOne({ candidatId, offreId });
        if (candidatureExiste) {
            return res.status(400).json({ 
                success: false,
                message: 'Vous avez déjà postulé à cette offre' 
            });
        }
        
        const candidature = await Candidature.create({
            candidatId,
            offreId,
            scoreIA: scoreIA || 0
        });
        
        // Populate pour renvoyer les infos complètes
        await candidature.populate([
            { path: 'candidatId', select: 'nom email' },
            { path: 'offreId', select: 'titre description' }
        ]);
        
        res.status(201).json({
            success: true,
            message: 'Candidature envoyée avec succès',
            candidature
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ READ - Obtenir toutes les candidatures
exports.getAllCandidatures = async (req, res) => {
    try {
        const candidatures = await Candidature.find()
            .populate('candidatId', 'nom email')
            .populate('offreId', 'titre description entrepriseId')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: candidatures.length,
            candidatures
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ READ - Obtenir une candidature par ID
exports.getCandidatureById = async (req, res) => {
    try {
        const candidature = await Candidature.findById(req.params.id)
            .populate('candidatId', 'nom email')
            .populate('offreId', 'titre description entrepriseId');
        
        if (!candidature) {
            return res.status(404).json({ 
                success: false,
                message: 'Candidature non trouvée' 
            });
        }
        
        res.json({
            success: true,
            candidature
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ UPDATE - Mettre à jour le statut d'une candidature
exports.updateCandidatureStatut = async (req, res) => {
    try {
        const { statut, scoreIA } = req.body;
        
        const candidature = await Candidature.findByIdAndUpdate(
            req.params.id,
            { statut, scoreIA },
            { new: true, runValidators: true }
        )
            .populate('candidatId', 'nom email')
            .populate('offreId', 'titre description');
        
        if (!candidature) {
            return res.status(404).json({ 
                success: false,
                message: 'Candidature non trouvée' 
            });
        }
        
        res.json({
            success: true,
            message: 'Candidature mise à jour avec succès',
            candidature
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

//  DELETE - Supprimer une candidature
exports.deleteCandidature = async (req, res) => {
    try {
        const candidature = await Candidature.findByIdAndDelete(req.params.id);
        
        if (!candidature) {
            return res.status(404).json({ 
                success: false,
                message: 'Candidature non trouvée' 
            });
        }
        
        res.json({
            success: true,
            message: 'Candidature supprimée avec succès',
            candidature: {
                id: candidature._id
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Obtenir les candidatures d'un candidat
exports.getCandidaturesByCandidat = async (req, res) => {
    try {
        const candidatures = await Candidature.find({ candidatId: req.params.candidatId })
            .populate('offreId', 'titre description entrepriseId')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: candidatures.length,
            candidatures
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

//  Obtenir les candidatures pour une offre
exports.getCandidaturesByOffre = async (req, res) => {
    try {
        const candidatures = await Candidature.find({ offreId: req.params.offreId })
            .populate('candidatId', 'nom email')
            .sort({ scoreIA: -1 });  // Trier par score IA (meilleur en premier)
        
        res.json({
            success: true,
            count: candidatures.length,
            candidatures
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

//  Obtenir les candidatures par statut
exports.getCandidaturesByStatut = async (req, res) => {
    try {
        const { statut } = req.params;
        
        const candidatures = await Candidature.find({ statut })
            .populate('candidatId', 'nom email')
            .populate('offreId', 'titre description')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            statut,
            count: candidatures.length,
            candidatures
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};