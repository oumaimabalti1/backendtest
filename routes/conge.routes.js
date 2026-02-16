const express = require('express');
const router = express.Router();
const congeController = require('../controllers/congeController');

// Routes CRUD
router.post('/', congeController.createConge);                     // CREATE
router.get('/', congeController.getAllConges);                     // READ ALL
router.get('/:id', congeController.getCongeById);                  // READ ONE
router.put('/:id', congeController.updateCongeStatut);            // UPDATE
router.delete('/:id', congeController.deleteConge);                // DELETE

// Routes bonus
router.get('/employe/:employeId', congeController.getCongesByEmploye);     // BY EMPLOYEE
router.get('/statut/:statut', congeController.getCongesByStatut);          // BY STATUT

module.exports = router;