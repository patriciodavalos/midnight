const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Configure file upload storage
const storage = multer.diskStorage({
    destination: './uploads/',
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
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Email configuration (replace with your email service details)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-app-password'     // Replace with your app-specific password
    }
});

// Middleware to parse JSON
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Visit notification endpoint
app.post('/api/visit', (req, res) => {
    const { ip, city, country, timestamp } = req.body;
    
    // Send email notification
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'your-email@gmail.com', // Your email to receive notifications
        subject: 'New Website Visitor',
        text: `New visitor from IP: ${ip}\nLocation: ${city}, ${country}\nTime: ${timestamp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    res.status(200).send('Visit recorded');
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded or invalid file type');
    }

    // Send email notification for file upload
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'your-email@gmail.com',
        subject: 'New STL File Uploaded',
        text: `New STL file uploaded: ${req.file.filename}\nStored at: ${req.file.path}\nSize: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    res.status(200).send('File uploaded');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});