const CV = require('../models/cv.model');
const User = require('../models/user.model');

// Upload un CV
exports.uploadCV = async (req, res) => {
    try {
        const { texte, candidatId } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: 'Aucun fichier uploadé' 
            });
        }
        
        const candidat = await User.findOne({ _id: candidatId, role: 'candidat' });
        if (!candidat) {
            return res.status(404).json({ 
                success: false,
                message: 'Candidat non trouvé' 
            });
        }
        
        const cvExiste = await CV.findOne({ candidatId });
        if (cvExiste) {
            return res.status(400).json({ 
                success: false,
                message: 'Ce candidat a déjà un CV. Utilisez PUT pour le mettre à jour.' 
            });
        }
        
        const cv = await CV.create({
            fichier: req.file.filename,
            texte,
            candidatId
        });
        
        await cv.populate('candidatId', 'nom email');
        
        res.status(201).json({
            success: true,
            message: 'CV uploadé avec succès',
            cv
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};


// Obtenir tous les CVs
exports.getAllCVs = async (req, res) => {
    try {
        const cvs = await CV.find()
            .populate('candidatId', 'nom email')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: cvs.length,
            cvs
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Obtenir un CV par ID
exports.getCVById = async (req, res) => {
    try {
        const cv = await CV.findById(req.params.id)
            .populate('candidatId', 'nom email');
        
        if (!cv) {
            return res.status(404).json({ 
                success: false,
                message: 'CV non trouvé' 
            });
        }
        
        res.json({
            success: true,
            cv
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Mettre à jour un CV
exports.updateCV = async (req, res) => {
    try {
        const { texte } = req.body;
        
        const updateData = { texte };
        
        // Si un nouveau fichier est uploadé
        if (req.file) {
            updateData.fichier = req.file.filename;
        }
        
        const cv = await CV.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('candidatId', 'nom email');
        
        if (!cv) {
            return res.status(404).json({ 
                success: false,
                message: 'CV non trouvé' 
            });
        }
        
        res.json({
            success: true,
            message: 'CV mis à jour avec succès',
            cv
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Supprimer un CV
exports.deleteCV = async (req, res) => {
    try {
        const cv = await CV.findByIdAndDelete(req.params.id);
        
        if (!cv) {
            return res.status(404).json({ 
                success: false,
                message: 'CV non trouvé' 
            });
        }
        
        res.json({
            success: true,
            message: 'CV supprimé avec succès',
            cv: {
                id: cv._id,
                fichier: cv.fichier
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

//  Obtenir le CV d'un candidat
exports.getCVByCandidat = async (req, res) => {
    try {
        const cv = await CV.findOne({ candidatId: req.params.candidatId })
            .populate('candidatId', 'nom email');
        
        if (!cv) {
            return res.status(404).json({ 
                success: false,
                message: 'Aucun CV trouvé pour ce candidat' 
            });
        }
        
        res.json({
            success: true,
            cv
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};