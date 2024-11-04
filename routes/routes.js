const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UserController');
const multer = require('multer');
const User=require("../models/users");
const jwt = require('jsonwebtoken');

// Multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('image');

// Admin Authentication Middleware
const adminAuth = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided. Access denied.' });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key

        // Check if the decoded token has an 'admin' role
        if (decoded.role === 'admin') {
            req.user = decoded; // Attach user info to req.user if needed for further use
            return next();
        } else {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

    } catch (error) {
        console.error('Error in adminAuth middleware:', error);
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
};



// Routes
<<<<<<< HEAD
router.post("/add", upload, userController.addUser); // Handle new user creation
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", upload, userController.editUser);
router.delete("/users/:id", userController.deleteUser);
=======

router.post("/add", upload, userController.addUser); // Handle new user creation
>>>>>>> 7d56bc9 (Initial commit)
router.post("/verify-email", userController.verifyEmail); // Verify the email

router.post("/accept-access/:id", adminAuth, userController.acceptAccess); // Admin-only route
router.post("/deny-access/:id", adminAuth, userController.denyAccess); // Admin-only route
router.post("/user/login", userController.LoginUser);
<<<<<<< HEAD


=======
router.post("/reset-password", userController.requestPasswordReset);
router.post('/reset-password/:token',userController.resetPassword);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", upload, userController.editUser);
router.delete("/users/:id", userController.deleteUser);
>>>>>>> 7d56bc9 (Initial commit)
module.exports = router;
