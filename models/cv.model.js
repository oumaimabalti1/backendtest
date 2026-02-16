const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
    fichier: {
        type: String,
        required: true
    },
    texte: {
        type: String
    },
    candidatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('CV', cvSchema);