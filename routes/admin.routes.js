const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');


router.post('/entreprise-rh', protect, authorize('admin'), adminController.createEntrepriseWithRH);
router.get('/entreprises', protect, authorize('admin'), adminController.getAllEntreprises);
router.delete('/entreprises/:id', protect, authorize('admin'), adminController.deleteEntreprise);
router.get('/statistiques', protect, authorize('admin'), adminController.getStatistiques);

module.exports = router;