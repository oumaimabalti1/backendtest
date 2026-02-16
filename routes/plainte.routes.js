const express = require('express');
const router = express.Router();
const plainteController = require('../controllers/plainteController');

// Routes CRUD
router.post('/', plainteController.createPlainte);                     // CREATE
router.get('/', plainteController.getAllPlaintes);                     // READ ALL
router.get('/:id', plainteController.getPlainteById);                  // READ ONE
router.put('/:id', plainteController.updatePlainte);                   // UPDATE
router.delete('/:id', plainteController.deletePlainte);                // DELETE

// Routes bonus
router.get('/employe/:employeId', plainteController.getPlaintesByEmploye);     // BY EMPLOYEE
router.get('/statut/:statut', plainteController.getPlaintesByStatut);          // BY STATUT

module.exports = router;