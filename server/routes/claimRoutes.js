const express = require('express');
const router = express.Router();
const {
    createClaim,
    getMyClaims,
    getItemClaims,
    updateClaimStatus,
} = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createClaim);
router.route('/my').get(protect, getMyClaims);
router.route('/item/:itemId').get(protect, getItemClaims);
router.route('/:id').put(protect, updateClaimStatus);

module.exports = router;
