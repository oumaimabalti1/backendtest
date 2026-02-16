const express = require('express');
const router = express.Router();
const entrepriseController = require('../controllers/entrepriseController');

// Routes CRUD
router.post('/', entrepriseController.createEntreprise);
router.get('/', entrepriseController.getAllEntreprises);
router.get('/:id', entrepriseController.getEntrepriseById);
router.put('/:id', entrepriseController.updateEntreprise);
router.delete('/:id', entrepriseController.deleteEntreprise);

// Route bonus
router.get('/:id/employees', entrepriseController.getEntrepriseEmployees);

module.exports = router;
