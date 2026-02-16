const Entreprise = require('../models/entreprise.model');
const User = require('../models/user.model');

// ✅ Créer Entreprise + Compte RH en une seule fois
exports.createEntrepriseWithRH = async (req, res) => {
    try {
        const { 
            // Données de l'entreprise
            nomEntreprise,
            emailEntreprise,
            secteur,
            
            // Données du RH
            nomRH,
            emailRH,
            motDePasseRH,
            departement
        } = req.body;
        
        // 1️⃣ Vérifier si l'email de l'entreprise existe déjà
        const entrepriseExiste = await Entreprise.findOne({ email: emailEntreprise });
        if (entrepriseExiste) {
            return res.status(400).json({ 
                success: false,
                message: 'Email d\'entreprise déjà utilisé' 
            });
        }
        
        // 2️⃣ Vérifier si l'email du RH existe déjà
        const rhExiste = await User.findOne({ email: emailRH });
        if (rhExiste) {
            return res.status(400).json({ 
                success: false,
                message: 'Email RH déjà utilisé' 
            });
        }
        
        // 3️⃣ Créer l'entreprise
        const entreprise = await Entreprise.create({
            nom: nomEntreprise,
            email: emailEntreprise,
            secteur
        });
        
        // 4️⃣ Créer le compte RH lié à cette entreprise
        const rh = await User.create({
            nom: nomRH,
            email: emailRH,
            motDePasse: motDePasseRH,
            role: 'RH',
            entrepriseId: entreprise._id,
            departement
        });
        
        res.status(201).json({
            success: true,
            message: 'Entreprise et compte RH créés avec succès',
            data: {
                entreprise: {
                    id: entreprise._id,
                    nom: entreprise.nom,
                    email: entreprise.email,
                    secteur: entreprise.secteur
                },
                rh: {
                    id: rh._id,
                    nom: rh.nom,
                    email: rh.email,
                    role: rh.role,
                    entrepriseId: rh.entrepriseId,
                    departement: rh.departement
                }
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ Obtenir toutes les entreprises (vue Admin)
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

// ✅ Supprimer entreprise (et tous ses utilisateurs)
exports.deleteEntreprise = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Supprimer l'entreprise
        const entreprise = await Entreprise.findByIdAndDelete(id);
        
        if (!entreprise) {
            return res.status(404).json({ 
                success: false,
                message: 'Entreprise non trouvée' 
            });
        }
        
        // Supprimer tous les RH et Employees liés
        await User.deleteMany({ entrepriseId: id });
        
        res.json({
            success: true,
            message: 'Entreprise et utilisateurs associés supprimés',
            entreprise: {
                id: entreprise._id,
                nom: entreprise.nom
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ Statistiques pour dashboard Admin
exports.getStatistiques = async (req, res) => {
    try {
        const totalEntreprises = await Entreprise.countDocuments();
        const totalRH = await User.countDocuments({ role: 'RH' });
        const totalEmployees = await User.countDocuments({ role: 'employee' });
        const totalCandidats = await User.countDocuments({ role: 'candidat' });
        
        res.json({
            success: true,
            statistiques: {
                entreprises: totalEntreprises,
                rh: totalRH,
                employees: totalEmployees,
                candidats: totalCandidats,
                totalUsers: totalRH + totalEmployees + totalCandidats
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};