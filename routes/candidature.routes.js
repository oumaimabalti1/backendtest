const express = require('express');
const router = express.Router();
const candidatureController = require('../controllers/candidatureController');


router.post('/', candidatureController.createCandidature);                     // ajout
router.get('/', candidatureController.getAllCandidatures);                     // lit tout
router.get('/:id', candidatureController.getCandidatureById);                  // lit une 
router.put('/:id', candidatureController.updateCandidatureStatut);            // mise a jour
router.delete('/:id', candidatureController.deleteCandidature);                // supp
router.get('/candidat/:candidatId', candidatureController.getCandidaturesByCandidat);  // by candidat
router.get('/offre/:offreId', candidatureController.getCandidaturesByOffre);          //by offre
router.get('/statut/:statut', candidatureController.getCandidaturesByStatut);         // by statut

module.exports = router;