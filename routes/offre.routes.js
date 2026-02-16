const express = require('express');
const router = express.Router();
const offreController = require('../controllers/offreController');

// Routes CRUD
router.post('/', offreController.createOffre);                              // CREATE
router.get('/', offreController.getAllOffres);                              // READ ALL
router.get('/:id', offreController.getOffreById);                           // READ ONE
router.put('/:id', offreController.updateOffre);                            // UPDATE
router.delete('/:id', offreController.deleteOffre);                         // DELETE

// Route bonus
router.get('/entreprise/:entrepriseId', offreController.getOffresByEntreprise);  // GET BY ENTREPRISE

module.exports = router;