const Item = require('../models/Item');
const { findMatches } = require('../services/matchingService');

// @desc    Get all items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const count = await Item.countDocuments({ ...keyword });
    const items = await Item.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ items, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
    const item = await Item.findById(req.params.id).populate('user', 'name email');

    if (item) {
        res.json(item);
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
};

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
    const {
        type,
        title,
        description,
        category,
        location,
        date,
        images,
        verificationQuestions,
    } = req.body;

    console.log('Creating item with data:', { ...req.body, user: req.user._id });
    const item = new Item({
        type,
        title,
        description,
        category,
        location,
        date,
        images,
        verificationQuestions,
        user: req.user._id,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (item) {
        if (item.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            res.status(401);
            throw new Error('Not authorized to update this item');
        }

        item.title = req.body.title || item.title;
        item.description = req.body.description || item.description;
        item.category = req.body.category || item.category;
        item.location = req.body.location || item.location;
        item.date = req.body.date || item.date;
        item.images = req.body.images || item.images;
        item.verificationQuestions = req.body.verificationQuestions || item.verificationQuestions;
        item.status = req.body.status || item.status;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (item) {
        if (item.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            res.status(401);
            throw new Error('Not authorized to delete this item');
        }

        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
};

// @desc    Get matches for an item
// @route   GET /api/items/:id/matches
// @access  Private
const getMatches = async (req, res) => {
    try {
        const matches = await findMatches(req.params.id);
        res.json(matches);
    } catch (error) {
        res.status(404);
        throw new Error(error.message);
    }
};

module.exports = {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    getMatches,
};
