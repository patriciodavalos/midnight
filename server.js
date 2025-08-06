const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname)));

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).send('File uploaded successfully');
    } else {
        res.status(400).send('No file uploaded');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
