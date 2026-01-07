const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    claimer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    answers: [{ // Answers to verification questions
        question: String,
        answer: String,
    }],
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING',
    },
    proofImages: [{
        type: String,
    }],
    finderFeedback: {
        type: String,
    },
}, {
    timestamps: true,
});

const Claim = mongoose.model('Claim', claimSchema);

module.exports = Claim;
