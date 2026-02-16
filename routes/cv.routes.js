const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cvController');
const uploadfile = require('../middlewares/uploadfile');  // ← TON MIDDLEWARE

// Routes CRUD
router.post('/', uploadfile.single('cv'), cvController.uploadCV);           // CREATE avec upload
router.get('/', cvController.getAllCVs);
router.get('/candidat/:candidatId', cvController.getCVByCandidat);                                       // READ ALL
router.get('/:id', cvController.getCVById);                                  // READ ONE
router.put('/:id', uploadfile.single('cv'), cvController.updateCV);         // UPDATE avec upload optionnel
router.delete('/:id', cvController.deleteCV);                                // DELETE

// Route bonus
        // BY CANDIDAT

module.exports = router;