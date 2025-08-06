const fs = require('fs').promises;
const path = require('path');

const uploadDir = '/tmp/Uploads';

module.exports = async (req, res) => {
    try {
        const files = await fs.readdir(uploadDir);
        const fileList = await Promise.all(files.map(async (file) => {
            const stats = await fs.stat(path.join(uploadDir, file));
            return {
                name: file,
                path: path.join(uploadDir, file),
                size: stats.size / 1024 / 1024 // Size in MB
            };
        }));
        console.log('Listed uploaded files:', fileList);
        res.status(200).json(fileList);
    } catch (err) {
        console.error('Error reading uploads directory:', err);
        res.status(500).send('Error reading uploads directory');
    }
};