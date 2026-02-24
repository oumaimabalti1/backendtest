const express = require('express');
const router = express.Router();
const offreController = require('../controllers/offreController');

// Routes CRUD
router.post('/', offreController.createOffre);                              
router.get('/', offreController.getAllOffres);                              
router.get('/:id', offreController.getOffreById);                           
router.put('/:id', offreController.updateOffre);                          
router.delete('/:id', offreController.deleteOffre);                         
router.get('/entreprise/:entrepriseId', offreController.getOffresByEntreprise);  //by ese

module.exports = router;