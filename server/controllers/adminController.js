const User = require('../models/User');
const Item = require('../models/Item');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const toggleBlockUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isBlocked = !user.isBlocked;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Delete item (Admin)
// @route   DELETE /api/admin/items/:id
// @access  Private/Admin
const deleteItemAdmin = async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (item) {
        await item.deleteOne();
        res.json({ message: 'Item removed by admin' });
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
};

// @desc    Mark item as suspicious
// @route   PUT /api/admin/items/:id/suspicious
// @access  Private/Admin
const toggleSuspiciousItem = async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (item) {
        item.isSuspicious = !item.isSuspicious;
        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
};

module.exports = { getUsers, toggleBlockUser, deleteItemAdmin, toggleSuspiciousItem };
