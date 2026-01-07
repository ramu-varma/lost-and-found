const Claim = require('../models/Claim');
const Item = require('../models/Item');

// @desc    Create a new claim
// @route   POST /api/claims
// @access  Private
const createClaim = async (req, res) => {
    console.log('Received claim request body:', JSON.stringify(req.body, null, 2));
    console.log('Type of answers:', typeof req.body.answers);
    console.log('Is answers array?', Array.isArray(req.body.answers));
    const { itemId, answers, proofImages } = req.body;

    // Normalize answers if they are sent as simple strings (backward compatibility/robustness)
    let normalizedAnswers = [];
    if (Array.isArray(answers)) {
        normalizedAnswers = answers.map((ans, index) => {
            if (typeof ans === 'string') {
                return { question: `Question ${index + 1}`, answer: ans };
            }
            return ans;
        });
    }

    const item = await Item.findById(itemId);

    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    if (item.type !== 'FOUND') {
        res.status(400);
        throw new Error('Can only claim found items');
    }

    const existingClaim = await Claim.findOne({
        item: itemId,
        claimer: req.user._id,
    });

    if (existingClaim) {
        res.status(400);
        throw new Error('You have already submitted a claim for this item');
    }

    const claim = new Claim({
        item: itemId,
        claimer: req.user._id,
        answers: normalizedAnswers,
        proofImages,
    });

    const createdClaim = await claim.save();
    res.status(201).json(createdClaim);
};

// @desc    Get claims for a user (as claimer)
// @route   GET /api/claims/my
// @access  Private
const getMyClaims = async (req, res) => {
    const claims = await Claim.find({ claimer: req.user._id }).populate('item');
    res.json(claims);
};

// @desc    Get claims for an item (as finder/owner of item)
// @route   GET /api/claims/item/:itemId
// @access  Private
const getItemClaims = async (req, res) => {
    const item = await Item.findById(req.params.itemId);

    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    if (item.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to view claims for this item');
    }

    const claims = await Claim.find({ item: req.params.itemId }).populate(
        'claimer',
        'name email reputationScore'
    );
    res.json(claims);
};

// @desc    Update claim status (Approve/Reject)
// @route   PUT /api/claims/:id
// @access  Private
const updateClaimStatus = async (req, res) => {
    const { status } = req.body; // APPROVED or REJECTED
    const claim = await Claim.findById(req.params.id).populate('item');

    if (!claim) {
        res.status(404);
        throw new Error('Claim not found');
    }

    if (claim.item.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this claim');
    }

    claim.status = status;
    await claim.save();

    if (status === 'APPROVED') {
        const item = await Item.findById(claim.item._id);
        item.status = 'MATCHED'; // Or CLOSED
        await item.save();
    }

    res.json(claim);
};

module.exports = {
    createClaim,
    getMyClaims,
    getItemClaims,
    updateClaimStatus,
};
