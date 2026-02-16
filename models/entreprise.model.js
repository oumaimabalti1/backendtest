const mongoose = require('mongoose');

const entrepriseSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    email: {
        type: String,required: true, unique: true
    },
    secteur: {
        type: String,required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Entreprise', entrepriseSchema);