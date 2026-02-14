const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// CRUD Routes
router.post('/', userController.createUser);              // CREATE
router.get('/', userController.getAllUsers);              // READ ALL
router.get('/:id', userController.getUserById); 
router.get('/role/:role', userController.getUsersByRole);          // READ ONE
router.put('/:id', userController.updateUser);            // UPDATE
router.delete('/:id', userController.deleteUser);         // DELETE


module.exports = router;