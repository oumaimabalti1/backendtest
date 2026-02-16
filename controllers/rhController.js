const User = require('../models/user.model');
const Offre = require('../models/offre.model');
const Candidature = require('../models/candidature.model');
const Conge = require('../models/conge.model');
const Plainte = require('../models/plainte.model');

// ════════════════════════════════════════════════════
// GESTION DES EMPLOYÉS
// ════════════════════════════════════════════════════

// ✅ Créer un employé (dans son entreprise)
exports.createEmployee = async (req, res) => {
    try {
        const { nom, email, motDePasse, departement } = req.body;
        
        // Vérifier si l'email existe
        const userExiste = await User.findOne({ email });
        if (userExiste) {
            return res.status(400).json({ 
                success: false,
                message: 'Email déjà utilisé' 
            });
        }
        
        // Créer l'employé dans l'entreprise du RH
        const employee = await User.create({
            nom,
            email,
            motDePasse,
            role: 'employee',
            entrepriseId: req.user.entrepriseId,  // ← Entreprise du RH connecté
            departement
        });
        
        res.status(201).json({
            success: true,
            message: 'Employé créé avec succès',
            employee: {
                id: employee._id,
                nom: employee.nom,
                email: employee.email,
                departement: employee.departement
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ Obtenir tous les employés de son entreprise
exports.getMyEmployees = async (req, res) => {
    try {
        const employees = await User.find({ 
            role: 'employee',
            entrepriseId: req.user.entrepriseId  // ← Seulement son entreprise
        }).select('-motDePasse');
        
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

// ════════════════════════════════════════════════════
// GESTION DES OFFRES
// ════════════════════════════════════════════════════

// ✅ Publier une offre
exports.publishOffre = async (req, res) => {
    try {
        const { titre, description } = req.body;
        
        const offre = await Offre.create({
            titre,
            description,
            entrepriseId: req.user.entrepriseId  // ← Son entreprise
        });
        
        res.status(201).json({
            success: true,
            message: 'Offre publiée avec succès',
            offre
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ Obtenir les offres de son entreprise
exports.getMyOffres = async (req, res) => {
    try {
        const offres = await Offre.find({ 
            entrepriseId: req.user.entrepriseId 
        }).sort({ dateCreation: -1 });
        
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

// ✅ Modifier une offre
exports.updateOffre = async (req, res) => {
    try {
        const { titre, description } = req.body;
        
        // Vérifier que l'offre appartient à son entreprise
        const offre = await Offre.findOne({
            _id: req.params.id,
            entrepriseId: req.user.entrepriseId
        });
        
        if (!offre) {
            return res.status(404).json({ 
                success: false,
                message: 'Offre non trouvée ou accès refusé' 
            });
        }
        
        offre.titre = titre || offre.titre;
        offre.description = description || offre.description;
        await offre.save();
        
        res.json({
            success: true,
            message: 'Offre mise à jour',
            offre
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ Supprimer une offre
exports.deleteOffre = async (req, res) => {
    try {
        const offre = await Offre.findOneAndDelete({
            _id: req.params.id,
            entrepriseId: req.user.entrepriseId
        });
        
        if (!offre) {
            return res.status(404).json({ 
                success: false,
                message: 'Offre non trouvée ou accès refusé' 
            });
        }
        
        res.json({
            success: true,
            message: 'Offre supprimée avec succès'
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ════════════════════════════════════════════════════
// GESTION DES CANDIDATURES
// ════════════════════════════════════════════════════

// ✅ Obtenir les candidatures pour ses offres
exports.getMyCandidatures = async (req, res) => {
    try {
        // 1. Récupérer les IDs des offres de son entreprise
        const offres = await Offre.find({ 
            entrepriseId: req.user.entrepriseId 
        }).select('_id');
        
        const offreIds = offres.map(o => o._id);
        
        // 2. Récupérer les candidatures pour ces offres
        const candidatures = await Candidature.find({ 
            offreId: { $in: offreIds }
        })
            .populate('candidatId', 'nom email')
            .populate('offreId', 'titre description')
            .sort({ scoreIA: -1 });  // Meilleurs scores en premier
        
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

// ✅ Accepter une candidature
exports.acceptCandidature = async (req, res) => {
    try {
        const candidature = await Candidature.findById(req.params.id)
            .populate('offreId');
        
        if (!candidature) {
            return res.status(404).json({ 
                success: false,
                message: 'Candidature non trouvée' 
            });
        }
        
        // Vérifier que l'offre appartient à son entreprise
        if (candidature.offreId.entrepriseId.toString() !== req.user.entrepriseId.toString()) {
            return res.status(403).json({ 
                success: false,
                message: 'Accès refusé' 
            });
        }
        
        candidature.statut = 'ACCEPTEE';
        await candidature.save();
        
        await candidature.populate('candidatId', 'nom email');
        
        res.json({
            success: true,
            message: 'Candidature acceptée',
            candidature
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ Refuser une candidature
exports.refuseCandidature = async (req, res) => {
    try {
        const candidature = await Candidature.findById(req.params.id)
            .populate('offreId');
        
        if (!candidature) {
            return res.status(404).json({ 
                success: false,
                message: 'Candidature non trouvée' 
            });
        }
        
        // Vérifier que l'offre appartient à son entreprise
        if (candidature.offreId.entrepriseId.toString() !== req.user.entrepriseId.toString()) {
            return res.status(403).json({ 
                success: false,
                message: 'Accès refusé' 
            });
        }
        
        candidature.statut = 'REFUSEE';
        await candidature.save();
        
        await candidature.populate('candidatId', 'nom email');
        
        res.json({
            success: true,
            message: 'Candidature refusée',
            candidature
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ════════════════════════════════════════════════════
// GESTION DES CONGÉS
// ════════════════════════════════════════════════════

// ✅ Obtenir les demandes de congé de ses employés
exports.getEmployeeConges = async (req, res) => {
    try {
        // Récupérer les IDs des employés de son entreprise
        const employees = await User.find({ 
            entrepriseId: req.user.entrepriseId,
            role: 'employee'
        }).select('_id');
        
        const employeeIds = employees.map(e => e._id);
        
        // Récupérer les congés de ces employés
        const conges = await Conge.find({ 
            employeId: { $in: employeeIds }
        })
            .populate('employeId', 'nom email departement')
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

// ✅ Approuver un congé
exports.approveConge = async (req, res) => {
    try {
        const conge = await Conge.findById(req.params.id)
            .populate('employeId');
        
        if (!conge) {
            return res.status(404).json({ 
                success: false,
                message: 'Congé non trouvé' 
            });
        }
        
        // Vérifier que l'employé appartient à son entreprise
        if (conge.employeId.entrepriseId.toString() !== req.user.entrepriseId.toString()) {
            return res.status(403).json({ 
                success: false,
                message: 'Accès refusé' 
            });
        }
        
        conge.statut = 'APPROUVE';
        await conge.save();
        
        res.json({
            success: true,
            message: 'Congé approuvé',
            conge
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// ✅ Refuser un congé
exports.refuseConge = async (req, res) => {
    try {
        const conge = await Conge.findById(req.params.id)
            .populate('employeId');
        
        if (!conge) {
            return res.status(404).json({ 
                success: false,
                message: 'Congé non trouvé' 
            });
        }
        
        // Vérifier que l'employé appartient à son entreprise
        if (conge.employeId.entrepriseId.toString() !== req.user.entrepriseId.toString()) {
            return res.status(403).json({ 
                success: false,
                message: 'Accès refusé' 
            });
        }
        
        conge.statut = 'REFUSE';
        await conge.save();
        
        res.json({
            success: true,
            message: 'Congé refusé',
            conge
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

// ✅ Obtenir les plaintes de ses employés
exports.getEmployeePlaintes = async (req, res) => {
    try {
        // Récupérer les IDs des employés de son entreprise
        const employees = await User.find({ 
            entrepriseId: req.user.entrepriseId,
            role: 'employee'
        }).select('_id');
        
        const employeeIds = employees.map(e => e._id);
        
        // Récupérer les plaintes de ces employés
        const plaintes = await Plainte.find({ 
            employeId: { $in: employeeIds }
        })
            .populate('employeId', 'nom email departement')
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

// ✅ Répondre à une plainte
exports.replyPlainte = async (req, res) => {
    try {
        const { reponse } = req.body;
        
        const plainte = await Plainte.findById(req.params.id)
            .populate('employeId');
        
        if (!plainte) {
            return res.status(404).json({ 
                success: false,
                message: 'Plainte non trouvée' 
            });
        }
        
        // Vérifier que l'employé appartient à son entreprise
        if (plainte.employeId.entrepriseId.toString() !== req.user.entrepriseId.toString()) {
            return res.status(403).json({ 
                success: false,
                message: 'Accès refusé' 
            });
        }
        
        plainte.reponse = reponse;
        plainte.statut = 'TRAITEE';
        await plainte.save();
        
        res.json({
            success: true,
            message: 'Réponse envoyée',
            plainte
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};