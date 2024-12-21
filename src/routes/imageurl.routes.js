import express from 'express';

const router = express.Router();

const extractFileId = (url) => {
    const regex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

router.get('/', (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL query parameter is required' });
    }

    const fileId = extractFileId(url);

    if (!fileId) {
        return res.status(400).json({ error: 'Invalid Google Drive URL' });
    }

    const convertedUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    res.json({ url: convertedUrl });
});

export default router;