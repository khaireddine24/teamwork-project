// Required libraries
const User = require('../models/users');
const multer = require('multer');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Ensure 'uploads' folder exists
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
const upload = multer({ storage: storage }).single('image');

// Nodemailer setup (using Mailtrap)
const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '98d772f0f26841', // Mailtrap credentials
        pass: '56a1b9eaddd4fb'
    }
});

// Function to initialize admin user if not already exists
const initializeAdmin = async () => {
    const adminEmail = 'admin@email.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin1213', 10);
        const adminUser = new User({
            name: 'Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });
        await adminUser.save();
    }
};

// Run admin initialization
initializeAdmin();

// Add new user with email verification
exports.addUser = async (req, res) => {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            role: req.body.role || 'user',
            image: req.file.filename,
            password: hashedPassword,
            verificationCode: verificationCode,
            verified: false
        });

        const mailOptions = {
            from: 'kthirithamer1@gmail.com',
            to: req.body.email,
            subject: 'Email Verification',
            text: `Your verification code is: ${verificationCode}`
        };

        await Promise.all([user.save(), transporter.sendMail(mailOptions)]);
        res.status(200).json({ message: "Verification email sent. You are on the verify email page." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.renderVerifyEmail = (req, res) => {
    res.render("verify_email", { title: "Verify Email" });
};

// Verify email with verification code
exports.verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        const user = await User.findOne({ email, verificationCode });
        if (!user) return res.status(400).json({ message: "Invalid verification code" });

        user.verified = true;
        user.verificationCode = null;
        await user.save();
        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login User, Admin differentiated by email and password
exports.LoginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

        let user;
        if (email === 'admin@email.com' && password === 'admin1213') {
            user = { _id: 'admin', email, role: 'admin' };
        } else {
            user = await User.findOne({ email });
            if (!user || !user.password) return res.status(400).json({ message: 'Invalid email or password' });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });

            if (!user.isAccessGranted) return res.status(403).json({ message: 'Access not granted. Please contact admin.' });
            user.role = 'user';
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No account with that email found.' });

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();
        const resetLink = `http://localhost:5000/reset-password/${token}`;
        const mailOptions = {
            to: user.email,
            from: 'kthirithamer1@gmail.com',
            subject: 'Password Reset Request',
            text: `Click on the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin grants or denies user access
exports.acceptAccess = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isAccessGranted = true;
        await user.save();
        await transporter.sendMail({
            from: 'kthirithamer1@gmail.com',
            to: user.email,
            subject: 'Access Granted',
            text: `Hello ${user.name}, your access has been granted.`
        });
        res.status(200).json({ message: 'Access granted and email sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.denyAccess = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isAccessGranted = false;
        await user.save();
        await transporter.sendMail({
            from: 'kthirithamer1@gmail.com',
            to: user.email,
            subject: 'Access Denied',
            text: `Hello ${user.name}, your access request has been denied.`
        });
        res.status(200).json({ message: 'Access denied and email sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.renderAddUser = (req, res) => {
    res.status(200).json({ message: 'Add User page', title: "Add User" });
};
