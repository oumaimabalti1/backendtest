const express = require('express');
const router = express.Router();
const congeController = require('../controllers/congeController');


router.post('/', congeController.createConge);                     
router.get('/', congeController.getAllConges);                     // all
router.get('/:id', congeController.getCongeById);                  // une seule
router.put('/:id', congeController.updateCongeStatut);            
router.delete('/:id', congeController.deleteConge);                
router.get('/employe/:employeId', congeController.getCongesByEmploye);     
router.get('/statut/:statut', congeController.getCongesByStatut);          

module.exports = router;