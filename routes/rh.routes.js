const express = require('express');
const router = express.Router();
const rhController = require('../controllers/rhController');


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
router.put('/offres/:id', rhController.updateOffre);
router.delete('/offres/:id', rhController.deleteOffre);

// ─────────────────────────────────────────
// GESTION DES CANDIDATURES
// ─────────────────────────────────────────
router.get('/candidatures', rhController.getMyCandidatures);
router.put('/candidatures/:id/accept', rhController.acceptCandidature);
router.put('/candidatures/:id/refuse', rhController.refuseCandidature);

// ─────────────────────────────────────────
// GESTION DES CONGÉS
// ─────────────────────────────────────────
router.get('/conges', rhController.getEmployeeConges);
router.put('/conges/:id/approve', rhController.approveConge);
router.put('/conges/:id/refuse', rhController.refuseConge);

// ─────────────────────────────────────────
// GESTION DES PLAINTES
// ─────────────────────────────────────────
router.get('/plaintes', rhController.getEmployeePlaintes);
router.put('/plaintes/:id/reply', rhController.replyPlainte);

module.exports = router;