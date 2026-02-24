const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cvController');
const uploadfile = require('../middlewares/uploadfile');  // ← TON MIDDLEWARE

// Routes CRUD
router.post('/', uploadfile.single('cv'), cvController.uploadCV);           // cree avec upload
router.get('/', cvController.getAllCVs);
router.get('/candidat/:candidatId', cvController.getCVByCandidat);          //lire tout
router.get('/:id', cvController.getCVById);                                  // read one
router.put('/:id', uploadfile.single('cv'), cvController.updateCV);         // mise a jouravec upload optionnel
router.delete('/:id', cvController.deleteCV);                                // supp



module.exports = router;