const express = require('express');
const router = express.Router();
const plainteController = require('../controllers/plainteController');

router.post('/', plainteController.createPlainte);
router.get('/', plainteController.getAllPlaintes);

// Routes spécifiques AVANT /:id pour éviter le conflit
router.get('/employe/:employeId', plainteController.getPlaintesByEmploye);
router.get('/statut/:statut', plainteController.getPlaintesByStatut);

router.get('/:id', plainteController.getPlainteById);
router.put('/:id', plainteController.updatePlainte);
router.delete('/:id', plainteController.deletePlainte);

module.exports = router;