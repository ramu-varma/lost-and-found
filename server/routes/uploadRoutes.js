const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

router.post('/', (req, res, next) => {
    console.log('POST /api/upload - Request received');
    next();
}, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Cloudinary
        // If you have valid credentials, this works. If not, we just return the local path.
        // For this demo, we'll try cloudinary, fall back to local.

        let imageUrl = req.file.path;

        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name') {
            console.log('Uploading to Cloudinary...');
            const result = await cloudinary.uploader.upload(req.file.path);
            console.log('Cloudinary Result:', result);
            imageUrl = result.secure_url;
            // Remove file from local uploads folder after upload
            fs.unlinkSync(req.file.path);
        } else {
            console.log('Falling back to local storage...');
            // Construct local URL (assuming static serve)
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        console.log('Final Image URL:', imageUrl);
        res.json({
            url: imageUrl,
            imageUrl: imageUrl, // For compatibility with old frontend
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
});

module.exports = router;
