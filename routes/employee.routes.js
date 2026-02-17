const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Toutes les routes nécessitent d'être Employee
router.use(protect, authorize('employee'));

// ─────────────────────────────────────────
// GESTION DES CONGÉS
// ─────────────────────────────────────────
router.post('/conges', employeeController.demanderConge);
router.get('/conges', employeeController.getMesConges);
router.delete('/conges/:id', employeeController.annulerConge);

// ─────────────────────────────────────────
// GESTION DES PLAINTES
// ─────────────────────────────────────────
router.post('/plaintes', employeeController.envoyerPlainte);
router.get('/plaintes', employeeController.getMesPlaintes);
router.get('/plaintes/:id', employeeController.getPlainteById);

module.exports = router;