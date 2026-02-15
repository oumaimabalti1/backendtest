var express = require('express');
var router = express.Router();

// Importer les routes
const userRoutes = require('./users.routes');

/* GET home page */
router.get('/', function(req, res, next) {
  res.json({ message: 'API fonctionne !', version: '1.0' });
});

// Utiliser les routes users
router.use('/users', userRoutes);

module.exports = router;