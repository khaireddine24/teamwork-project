const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UserController');
const multer = require('multer');

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
const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

// Routes
router.post("/add", upload, userController.addUser); // Handle new user creation
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", upload, userController.editUser);
router.delete("/users/:id", userController.deleteUser);
router.post("/verify-email", userController.verifyEmail); // Verify the email

router.post("/accept-access/:id", adminAuth, userController.acceptAccess); // Admin-only route
router.post("/deny-access/:id", adminAuth, userController.denyAccess); // Admin-only route
router.post("/user/login", userController.LoginUser);


module.exports = router;
