const Offre = require('../models/offre.model');
const Entreprise = require('../models/entreprise.model');

//  Créer une offre
exports.createOffre = async (req, res) => {
    try {
        const { titre, description, entrepriseId } = req.body;
        
        // Vérifier que l'entreprise existe
        const entreprise = await Entreprise.findById(entrepriseId);
        if (!entreprise) {
            return res.status(404).json({ 
                success: false,
                message: 'Entreprise non trouvée' 
            });
        }
        
        const offre = await Offre.create({
            titre,
            description,
            entrepriseId
        });
        
        // Populate pour renvoyer les infos de l'entreprise
        await offre.populate('entrepriseId', 'nom email secteur');
        
        res.status(201).json({
            success: true,
            message: 'Offre créée avec succès',
            offre
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

//  Obtenir toutes les offres
exports.getAllOffres = async (req, res) => {
    try {
        const offres = await Offre.find()
            .populate('entrepriseId', 'nom email secteur')
            .sort({ dateCreation: -1 });  // Plus récentes en premier
        
        res.json({
            success: true,
            count: offres.length,
            offres
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

//  Obtenir une offre par ID
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

//  Mettre à jour une offre
exports.updateOffre = async (req, res) => {
    try {
        const { titre, description } = req.body;
        
        const offre = await Offre.findByIdAndUpdate(
            req.params.id,
            { titre, description },
            { new: true, runValidators: true }
        ).populate('entrepriseId', 'nom email secteur');
        
        if (!offre) {
            return res.status(404).json({ 
                success: false,
                message: 'Offre non trouvée' 
            });
        }
        
        res.json({
            success: true,
            message: 'Offre mise à jour avec succès',
            offre
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Supprimer une offre
exports.deleteOffre = async (req, res) => {
    try {
        const offre = await Offre.findByIdAndDelete(req.params.id);
        
        if (!offre) {
            return res.status(404).json({ 
                success: false,
                message: 'Offre non trouvée' 
            });
        }
        
        res.json({
            success: true,
            message: 'Offre supprimée avec succès',
            offre: {
                id: offre._id,
                titre: offre.titre
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

//  Obtenir les offres d'une entreprise
exports.getOffresByEntreprise = async (req, res) => {
    try {
        const offres = await Offre.find({ entrepriseId: req.params.entrepriseId })
            .populate('entrepriseId', 'nom email secteur')
            .sort({ dateCreation: -1 });
        
        res.json({
            success: true,
            count: offres.length,
            offres
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};