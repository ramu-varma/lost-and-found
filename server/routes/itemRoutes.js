const express = require('express');
const router = express.Router();
const {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    getMatches,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getItems).post(protect, createItem);
router.route('/:id/matches').get(protect, getMatches);
router
    .route('/:id')
    .get(getItemById)
    .put(protect, updateItem)
    .delete(protect, deleteItem);

module.exports = router;
