const express = require('express');
const router = express.Router();
const candidatController = require('../controllers/candidatController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const uploadfile = require('../middlewares/uploadfile');

// Toutes les routes nécessitent d'être Candidat
router.use(protect, authorize('candidat'));


// offres

router.get('/offres', candidatController.getAllOffres);
router.get('/offres/:id', candidatController.getOffreById);


// candidatures

router.post('/candidatures', candidatController.postuler);
router.get('/candidatures', candidatController.getMesCandidatures);
router.get('/candidatures/:id', candidatController.getCandidatureById);
router.delete('/candidatures/:id', candidatController.annulerCandidature);


// CV

router.post('/cv', uploadfile.single('cv'), candidatController.uploadCV);
router.get('/cv', candidatController.getMonCV);
router.delete('/cv', candidatController.deleteMonCV);

module.exports = router;