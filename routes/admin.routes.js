const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route principale : Créer Entreprise + RH
router.post('/entreprise-rh', adminController.createEntrepriseWithRH);

// Gestion des entreprises
router.get('/entreprises', adminController.getAllEntreprises);
router.delete('/entreprises/:id', adminController.deleteEntreprise);

// Statistiques
router.get('/statistiques', adminController.getStatistiques);

module.exports = router;