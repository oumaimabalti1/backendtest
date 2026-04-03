const express = require('express');
const router = express.Router();
const rhController = require('../controllers/rhController');
const { protect, authorize } = require('../middlewares/authMiddleware');  // ← AJOUTER CETTE LIGNE

// Toutes les routes nécessitent d'être RH
router.use(protect, authorize('RH'));

// ─────────────────────────────────────────
// GESTION DES EMPLOYÉS
// ─────────────────────────────────────────
router.post('/employees', rhController.createEmployee);
router.get('/employees', rhController.getMyEmployees);

// ─────────────────────────────────────────
// GESTION DES OFFRES
// ─────────────────────────────────────────
router.post('/offres', rhController.publishOffre);
router.get('/offres', rhController.getMyOffres);
// Génération IA
router.post('/offres/generate-description', rhController.generateOffreDescription);
router.put('/offres/:id', rhController.updateOffre);
router.delete('/offres/:id', rhController.deleteOffre);


//candidatures
router.get('/candidatures', rhController.getMyCandidatures);
router.put('/candidatures/:id/accept', rhController.acceptCandidature);
router.put('/candidatures/:id/refuse', rhController.refuseCandidature);

//conges
router.get('/conges', rhController.getEmployeeConges);
router.put('/conges/:id/approve', rhController.approveConge);
router.put('/conges/:id/refuse', rhController.refuseConge);

//plaintes
router.get('/plaintes', rhController.getEmployeePlaintes);
router.put('/plaintes/:id/reply', rhController.replyPlainte);

module.exports = router;