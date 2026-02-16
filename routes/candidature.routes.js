const express = require('express');
const router = express.Router();
const candidatureController = require('../controllers/candidatureController');

// Routes CRUD
router.post('/', candidatureController.createCandidature);                     // CREATE
router.get('/', candidatureController.getAllCandidatures);                     // READ ALL
router.get('/:id', candidatureController.getCandidatureById);                  // READ ONE
router.put('/:id', candidatureController.updateCandidatureStatut);            // UPDATE
router.delete('/:id', candidatureController.deleteCandidature);                // DELETE

// Routes bonus
router.get('/candidat/:candidatId', candidatureController.getCandidaturesByCandidat);  // BY CANDIDAT
router.get('/offre/:offreId', candidatureController.getCandidaturesByOffre);          // BY OFFRE
router.get('/statut/:statut', candidatureController.getCandidaturesByStatut);         // BY STATUT

module.exports = router;