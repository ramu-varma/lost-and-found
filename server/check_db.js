const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const ItemSchema = new mongoose.Schema({
    title: String,
    images: [String],
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Item = mongoose.model('Item', ItemSchema);

async function checkItems() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const items = await Item.find().sort({ createdAt: -1 }).limit(5);
        console.log(JSON.stringify(items, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkItems();
