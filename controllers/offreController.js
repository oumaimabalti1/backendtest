const Offre = require('../models/offre.model');
const Entreprise = require('../models/entreprise.model');

// Créer une offre
exports.createOffre = async (req, res) => {
    try {
        const { titre, description, entrepriseId, domaine } = req.body;

        const entreprise = await Entreprise.findById(entrepriseId);
        if (!entreprise) {
            return res.status(404).json({ success: false, message: 'Entreprise non trouvée' });
        }

        const offre = await Offre.create({ titre, description, entrepriseId, domaine });
        await offre.populate('entrepriseId', 'nom email secteur');

        res.status(201).json({ success: true, message: 'Offre créée avec succès', offre });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtenir toutes les offres AVEC FILTRES
// Query params supportés :
//   ?domaine=Informatique
//   ?statut=active
//   ?periode=today | week | month
//   ?search=mot clé dans titre/description
//   (combinables : ?domaine=Informatique&periode=week)
exports.getAllOffres = async (req, res) => {
    try {
        const { domaine, statut, periode, search } = req.query;
        const filter = {};

        // Filtre par domaine
        if (domaine) filter.domaine = domaine;

        // Filtre par statut
        if (statut) filter.statut = statut;

        // Filtre par période
        if (periode) {
            const now = new Date();
            let dateFrom;
            if (periode === 'today') {
                dateFrom = new Date(now.setHours(0, 0, 0, 0));
            } else if (periode === 'week') {
                dateFrom = new Date();
                dateFrom.setDate(dateFrom.getDate() - 7);
            } else if (periode === 'month') {
                dateFrom = new Date();
                dateFrom.setMonth(dateFrom.getMonth() - 1);
            }
            if (dateFrom) filter.dateCreation = { $gte: dateFrom };
        }

        // Filtre par recherche texte (titre ou description)
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

// Obtenir une offre par ID
exports.getOffreById = async (req, res) => {
    try {
        const offre = await Offre.findById(req.params.id)
            .populate('entrepriseId', 'nom email secteur');

        if (!offre) return res.status(404).json({ success: false, message: 'Offre non trouvée' });

        res.json({ success: true, offre });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mettre à jour une offre
exports.updateOffre = async (req, res) => {
    try {
        const { titre, description, domaine, statut } = req.body;

        const offre = await Offre.findByIdAndUpdate(
            req.params.id,
            { titre, description, domaine, statut },
            { new: true, runValidators: true }
        ).populate('entrepriseId', 'nom email secteur');

        if (!offre) return res.status(404).json({ success: false, message: 'Offre non trouvée' });

        res.json({ success: true, message: 'Offre mise à jour avec succès', offre });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Supprimer une offre
exports.deleteOffre = async (req, res) => {
    try {
        const offre = await Offre.findByIdAndDelete(req.params.id);
        if (!offre) return res.status(404).json({ success: false, message: 'Offre non trouvée' });

        res.json({ success: true, message: 'Offre supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtenir les offres d'une entreprise (avec filtres aussi)
exports.getOffresByEntreprise = async (req, res) => {
    try {
        const { domaine, statut, periode } = req.query;
        const filter = { entrepriseId: req.params.entrepriseId };

        if (domaine) filter.domaine = domaine;
        if (statut) filter.statut = statut;
        if (periode) {
            const now = new Date();
            let dateFrom;
            if (periode === 'week') { dateFrom = new Date(); dateFrom.setDate(dateFrom.getDate() - 7); }
            else if (periode === 'month') { dateFrom = new Date(); dateFrom.setMonth(dateFrom.getMonth() - 1); }
            if (dateFrom) filter.dateCreation = { $gte: dateFrom };
        }

        const offres = await Offre.find(filter)
            .populate('entrepriseId', 'nom email secteur')
            .sort({ dateCreation: -1 });

        res.json({ success: true, count: offres.length, offres });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};