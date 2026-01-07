const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['LOST', 'FOUND'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true, // Can be text or coordinates later
    },
    date: {
        type: Date,
        required: true,
    },
    images: [{
        type: String, // URL from Cloudinary
    }],
    status: {
        type: String,
        enum: ['OPEN', 'MATCHED', 'CLOSED'],
        default: 'OPEN',
    },
    verificationQuestions: [{ // For FOUND items, questions to ask claimer
        type: String,
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isSuspicious: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Index for search
itemSchema.index({ title: 'text', description: 'text', category: 'text', location: 'text' });
itemSchema.index({ user: 1 });
itemSchema.index({ type: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ createdAt: -1 });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
