const mongoose = require('mongoose');

const plainteSchema = new mongoose.Schema({
    employeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sujet: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    reponse: {
        type: String
    },
    statut: {
        type: String,
        enum: ['EN_ATTENTE', 'TRAITEE'],
        default: 'EN_ATTENTE'
    }
}, { timestamps: true });

module.exports = mongoose.model('Plainte', plainteSchema);