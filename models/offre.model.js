const mongoose = require('mongoose');

const offreSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    domaine: {
        type: String,
        enum: [
            'Informatique',
            'Marketing',
            'Finance',
            'RH',
            'Commercial',
            'Juridique',
            'Ingénierie',
            'Design',
            'Communication',
            'Autre'
        ],
        default: 'Autre'
    },
    statut: {
        type: String,
        enum: ['active', 'fermee'],
        default: 'active'
    },
    dateCreation: {
        type: Date,
        default: Date.now
    },
    entrepriseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entreprise',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Offre', offreSchema);