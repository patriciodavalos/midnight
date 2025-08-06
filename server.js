const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Configure file upload storage
const storage = multer.diskStorage({
    destination: './Uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        if (extension !== '.stl') {
            return cb(new Error('Only STL files are allowed'));
        }
        cb(null, true);
    },
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Ensure uploads directory exists
const uploadDir = './Uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Email configuration (replace with your email service details)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'midnight.digitalm@gmail.com', // Replace with your email
        pass: '3Dprinting'     // Replace with your app-specific password
    }
});

// Middleware to parse JSON
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Visit notification endpoint
app.post('/api/visit', (req, res) => {
    const { ip, city, country, timestamp } = req.body;
    console.log('Received visit:', { ip, city, country, timestamp });

    // Send email notification
    const mailOptions = {
        from: 'midnight.digitalm@gmail.com',
        to: 'patriciodavalos8@gmail.com', // Your email to receive notifications
        subject: 'New Website Visitor',
        text: `New visitor from IP: ${ip}\nLocation: ${city}, ${country}\nTime: ${timestamp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending visit email:', error);
            return res.status(500).send('Error sending visit notification');
        }
        console.log('Visit email sent:', info.response);
        res.status(200).send('Visit recorded');
    });
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        console.error('No file uploaded or invalid file type');
        return res.status(400).send('No file uploaded or invalid file type');
    }

    console.log('File uploaded:', {
        filename: req.file.filename,
        path: req.file.path,
        size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`
    });

    // Send email notification for file upload
    const mailOptions = {
        from: 'midnight.digitalm@gmail.com',
        to: 'patriciodavalos8@gmail.com',
        subject: 'New STL File Uploaded',
        text: `New STL file uploaded: ${req.file.filename}\nStored at: ${req.file.path}\nSize: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending file upload email:', error);
        } else {
            console.log('File upload email sent:', info.response);
        }
    });

    res.status(200).send('File uploaded');
});

// Endpoint to list uploaded files
app.get('/api/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Error reading uploads directory:', err);
            return res.status(500).send('Error reading uploads directory');
        }
        const fileList = files.map(file => ({
            name: file,
            path: path.join(uploadDir, file),
            size: fs.statSync(path.join(uploadDir, file)).size / 1024 / 1024 // Size in MB
        }));
        console.log('Listed uploaded files:', fileList);
        res.status(200).json(fileList);
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
