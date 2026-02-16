const mongoose = require('mongoose');

const congeSchema = new mongoose.Schema({
    employeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,
        required: true
    },
    statut: {
        type: String,
        enum: ['EN_ATTENTE', 'APPROUVE', 'REFUSE'],
        default: 'EN_ATTENTE'
    }
}, { timestamps: true });

module.exports = mongoose.model('Conge', congeSchema);