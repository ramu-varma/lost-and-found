const Item = require('../models/Item');

const findMatches = async (itemId) => {
    const item = await Item.findById(itemId);

    if (!item) {
        throw new Error('Item not found');
    }

    const matchType = item.type === 'LOST' ? 'FOUND' : 'LOST';

    // Basic matching logic
    // 1. Same Category
    // 2. Text search on title/description (optional)
    // 3. Date range (optional)

    const matches = await Item.find({
        type: matchType,
        category: item.category,
        status: 'OPEN',
        // Simple text match if keywords exist
        $text: { $search: item.title }
    }).limit(10);

    return matches;
};

module.exports = { findMatches };
