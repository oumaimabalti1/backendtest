const Offre = require('../models/offre.model');
const Candidature = require('../models/candidature.model');
const CV = require('../models/cv.model');
const fs = require('fs');
const path = require('path');


// GESTION DES OFFRES


// Voir toutes les offres disponibles (avec filtres)
exports.getAllOffres = async (req, res) => {
    try {
        const { domaine, periode, search } = req.query;
        const filter = { statut: 'active' };

        if (domaine) filter.domaine = domaine;

        if (periode) {
            let dateFrom;
            if (periode === 'today') {
                dateFrom = new Date(); dateFrom.setHours(0, 0, 0, 0);
            } else if (periode === 'week') {
                dateFrom = new Date(); dateFrom.setDate(dateFrom.getDate() - 7);
            } else if (periode === 'month') {
                dateFrom = new Date(); dateFrom.setMonth(dateFrom.getMonth() - 1);
            }
            if (dateFrom) filter.dateCreation = { $gte: dateFrom };
        }

        if (search) {
            filter.$or = [
                { titre: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const offres = await Offre.find(filter)
            .populate('entrepriseId', 'nom email secteur')
            .sort({ dateCreation: -1 });

        res.json({ success: true, count: offres.length, offres });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Voir une offre en détail
exports.getOffreById = async (req, res) => {
    try {
        const offre = await Offre.findById(req.params.id)
            .populate('entrepriseId', 'nom email secteur');
        
        if (!offre) {
            return res.status(404).json({ 
                success: false,
                message: 'Offre non trouvée' 
            });
        }
        
        res.json({
            success: true,
            offre
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// GESTION DES CANDIDATURES

// Postuler à une offre
exports.postuler = async (req, res) => {
    try {
        const { offreId } = req.body;
        
        // Vérifier que l'offre existe
        const offre = await Offre.findById(offreId);
        if (!offre) {
            return res.status(404).json({ 
                success: false,
                message: 'Offre non trouvée' 
            });
        }
        
        // Vérifier si le candidat a déjà postulé
        const dejaCandidature = await Candidature.findOne({
            candidatId: req.user.id,
            offreId
        });
        
        if (dejaCandidature) {
            return res.status(400).json({ 
                success: false,
                message: 'Vous avez déjà postulé à cette offre' 
            });
        }

        // Récupérer le CV du candidat pour le scoring IA
        let scoreIA = 0;
        const cv = await CV.findOne({ candidatId: req.user.id });
        if (cv && cv.texte && cv.texte.trim().length > 20) {
            scoreIA = await scorerCV(cv.texte, offre.titre, offre.description);
        }
        
        // Créer la candidature avec le score IA
        const candidature = await Candidature.create({
            candidatId: req.user.id,
            offreId,
            statut: 'EN_ATTENTE',
            scoreIA
        });
        
        await candidature.populate([
            { path: 'candidatId', select: 'name email' },
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

// Voir mes candidatures
exports.getMesCandidatures = async (req, res) => {
    try {
        const candidatures = await Candidature.find({ 
            candidatId: req.user.id 
        })
            .populate({
                path: 'offreId',
                select: 'titre description entrepriseId',
                populate: {
                    path: 'entrepriseId',
                    select: 'nom secteur'
                }
            })
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

// Voir le statut d'une candidature
exports.getCandidatureById = async (req, res) => {
    try {
        const candidature = await Candidature.findOne({
            _id: req.params.id,
            candidatId: req.user.id  // ← Vérifier que c'est MA candidature
        })
            .populate('offreId', 'titre description entrepriseId')
            .populate({
                path: 'offreId',
                populate: {
                    path: 'entrepriseId',
                    select: 'nom email secteur'
                }
            });
        
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

// Annuler une candidature (si EN_ATTENTE)
exports.annulerCandidature = async (req, res) => {
    try {
        const candidature = await Candidature.findOne({
            _id: req.params.id,
            candidatId: req.user.id
        });
        
        if (!candidature) {
            return res.status(404).json({ 
                success: false,
                message: 'Candidature non trouvée' 
            });
        }
        
        // On peut annuler seulement si EN_ATTENTE
        if (candidature.statut !== 'EN_ATTENTE') {
            return res.status(400).json({ 
                success: false,
                message: 'Vous ne pouvez annuler qu\'une candidature en attente' 
            });
        }
        
        await Candidature.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Candidature annulée avec succès'
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};


// Upload/Mettre à jour mon CV
exports.uploadCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: 'Aucun fichier uploadé' 
            });
        }

        // Extraire le texte du PDF automatiquement
        let texte = '';
        try {
            const filePath = path.join(__dirname, '..', 'public', 'images', req.file.filename);
            console.log('PDF path:', filePath);
            console.log('File exists:', fs.existsSync(filePath));
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdfParse(dataBuffer);
            texte = pdfData.text?.trim() || '';
            console.log('Texte extrait (100 chars):', texte.substring(0, 100));
        } catch (pdfErr) {
            console.error('Erreur extraction PDF:', pdfErr.message);
            texte = '';
        }

        // Vérifier si le candidat a déjà un CV
        let cv = await CV.findOne({ candidatId: req.user.id });
        
        if (cv) {
            cv.fichier = req.file.filename;
            cv.texte = texte;
            await cv.save();
            
            res.json({
                success: true,
                message: 'CV mis à jour avec succès',
                cv
            });
        } else {
            cv = await CV.create({
                fichier: req.file.filename,
                texte,
                candidatId: req.user.id
            });
            
            res.status(201).json({
                success: true,
                message: 'CV uploadé avec succès',
                cv
            });
        }
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

//  Voir mon CV
exports.getMonCV = async (req, res) => {
    try {
        const cv = await CV.findOne({ candidatId: req.user.id });
        
        if (!cv) {
            return res.status(404).json({ 
                success: false,
                message: 'Aucun CV trouvé. Veuillez en uploader un.' 
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

// Supprimer mon CV
exports.deleteMonCV = async (req, res) => {
    try {
        const cv = await CV.findOneAndDelete({ candidatId: req.user.id });
        
        if (!cv) {
            return res.status(404).json({ 
                success: false,
                message: 'Aucun CV trouvé' 
            });
        }
        
        res.json({
            success: true,
            message: 'CV supprimé avec succès'
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};