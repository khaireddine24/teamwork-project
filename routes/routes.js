const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const nodemailer = require('nodemailer'); // Added for email sending

// image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname); 
    }
});

var upload = multer({
    storage: storage,
}).single('image');

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
        user: 'azizdhahri98918474@gmail.com', // Your email
        pass: 'bbwu icsw voev klyb', // Your password
    }
});

router.post("/add", upload, async (req, res) => {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit verification code

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        image: req.file.filename,
        verificationCode: verificationCode, 
        verified: false, 
    });

    try {
        await user.save();

        // send the verification vode
        const mailOptions = {
            from: 'azizdhahri98918474@gmail.com', 
            to: req.body.email, 
            subject: 'Email Verification',
            text: `Your verification code is: ${verificationCode}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending verification email', error });
            }

            req.session.message = {
                type: "success",
            
            };
            res.redirect("/verify-email");
        });
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

// Route verify_email.sjs
router.get("/verify-email", (req, res) => {
    res.render("verify_email", { title: "Verify Email" });
});


router.post("/verify-email", async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        
        const user = await User.findOne({ email: email, verificationCode: verificationCode });

        if (!user) {
            req.session.message = {
                type: "danger",
                
            };
            return res.redirect("/verify-email");
        }

        // verified
        user.verified = true;
        user.verificationCode = null;
        await user.save();

        req.session.message = {
            type: "success",
            message: "Email verified successfully!",
        };
        res.redirect("/"); 
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

// Route add_users.ejs
router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add users" });
});

module.exports = router;


//showing users
/**router.get("/",(req, res)=>{
    User.find().exec((err,users)=>{
        if(err){
            res.json({message:err.message});
        }else{
            res.render("index",{
                title:"Home page",
                users:users,
            });
        }
    });
    
    
    });
**/


