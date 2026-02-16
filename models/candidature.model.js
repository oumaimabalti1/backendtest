const mongoose = require('mongoose');

const candidatureSchema = new mongoose.Schema({
    statut: {
        type: String,
        enum: ['EN_ATTENTE', 'ACCEPTEE', 'REFUSEE'],
        default: 'EN_ATTENTE'
    },
    scoreIA: {
        type: Number,
        default: 0
    },
    candidatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    offreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offre',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Candidature', candidatureSchema);