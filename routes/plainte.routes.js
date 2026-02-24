const express = require('express');
const router = express.Router();
const plainteController = require('../controllers/plainteController');


router.post('/', plainteController.createPlainte);                    
router.get('/', plainteController.getAllPlaintes);                     
router.get('/:id', plainteController.getPlainteById);                 
router.put('/:id', plainteController.updatePlainte);                  
router.delete('/:id', plainteController.deletePlainte);                
router.get('/employe/:employeId', plainteController.getPlaintesByEmploye);    
router.get('/statut/:statut', plainteController.getPlaintesByStatut);          

module.exports = router;