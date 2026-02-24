const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Route principale : Créer Entreprise + RH
router.post('/entreprise-rh', protect, authorize('admin'), adminController.createEntrepriseWithRH);

// Gestion des entreprises
router.get('/entreprises', protect, authorize('admin'), adminController.getAllEntreprises);
router.delete('/entreprises/:id', protect, authorize('admin'), adminController.deleteEntreprise);

// Statistiques
router.get('/statistiques', protect, authorize('admin'), adminController.getStatistiques);

module.exports = router;