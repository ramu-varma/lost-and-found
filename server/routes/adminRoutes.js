const express = require('express');
const router = express.Router();
const { getUsers, toggleBlockUser, deleteItemAdmin, toggleSuspiciousItem } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/users', getUsers);
router.put('/users/:id/block', toggleBlockUser);
router.put('/items/:id/suspicious', toggleSuspiciousItem);
router.delete('/items/:id', deleteItemAdmin);

module.exports = router;
