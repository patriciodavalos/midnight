const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.stl') {
      cb(null, true);
    } else {
      cb(new Error('Only STL files are allowed'), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Serve static files from 'public'
app.use(express.static('public'));

// Handle file upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading file' });
  }
});

// Handle visit logging
app.post('/api/visit', express.json(), (req, res) => {
  console.log('Visit logged:', req.body);
  res.status(200).json({ message: 'Visit logged' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});