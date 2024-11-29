import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import * as userController from '../Controllers/UserController.js';
import * as ArticleController from '../Controllers/ArticleController.js';

const router = express.Router();

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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'No token provided. Access denied.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'admin') {
      req.user = decoded;
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

// user
router.get("/users/non-admins", adminAuth, userController.getNonAdminUsers);
router.get("/pending-employees", adminAuth, userController.getPendingEmployees);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", upload, userController.editUser);
router.delete("/users/:id", userController.deleteUser);


//Auth
router.post("/verify-email", userController.verifyEmail);
router.post("/accept-access/:id", adminAuth, userController.acceptAccess);
router.post("/deny-access/:id", adminAuth, userController.denyAccess);
router.post("/add", upload, userController.addUser);
router.post("/user/login", userController.Login);
router.post('/user/logout',userController.logout);
router.get("/check-auth", userController.checkAuth);
router.post("/reset-password", userController.requestPasswordReset);
router.post('/reset-password/:token', userController.resetPassword);

//Article
router.post("/articles/add", ArticleController.AddArticle);
router.put("/articles/:id",  ArticleController.editArticle);
router.get("/articles/:id", ArticleController.getArticleById);
router.get("/articles", ArticleController.getAllArticles);
router.delete("/articles/:id", ArticleController.DeleteArticleById);


export default router;