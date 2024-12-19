// Import required libraries
import { User } from '../models/users.js';
import multer from 'multer';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import fs from 'fs';
import path from 'path';
import { templates } from '../template/index.js';

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
const sendAdminNotification = async (subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: '98d772f0f26841',
                pass: '56a1b9eaddd4fb'
            }
        });

        const mailOptions = {
            from: 'thamerkthir@gmail.com',
            to: 'admin@email.com',    
            subject: subject,
            text: message
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to admin: ${subject}`);
    } catch (error) {
        console.error('Error sending admin notification:', error);
    }
};



// Nodemailer setup (using Mailtrap)
const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '98d772f0f26841',
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
export const addUser = async (req, res) => {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            role: req.body.role || 'user',
            image: req.file.filename,
            password: hashedPassword
        });

        const mailOptions = {
            from: req.body.email,
            to: req.body.email,
            subject: templates.emails.verificationCode(verificationCode).subject,
            text: templates.emails.verificationCode(verificationCode).text
        };

        await Promise.all([user.save(), transporter.sendMail(mailOptions)]);
        res.status(200).json({ message: "Verification email sent. You are on the verify email page." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const Login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        if (email === 'admin@email.com' && password === 'admin1213') {
            const adminToken = generateTokenAndSetCookie(res, 'admin');
            return res.status(200).json({
                success: true,
                message: "Logged in successfully",
                user: {
                    _id: 'admin',
                    email,
                    role: 'admin'
                },
                token: adminToken
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        if (!user.isAccessGranted && user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: "Access not granted. Please contact admin." 
            });
        }

        const token = generateTokenAndSetCookie(res, user._id);
        const userData = user.toObject();
        delete userData.password;

        if (!userData.role) {
            userData.role = 'user';
        }

        await user.save();
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...userData
            },
            token: token
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Error during login", 
            error: err.message 
        });
    }
};


export const logout=async(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({success:true,message:"Logged out successfully"});
}

// Fetch all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } })
            .select('-password -resetPasswordToken -resetPasswordExpires -verificationCode')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            users: users
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving users",
            error: error.message
        });
    }
};

// Fetch user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -resetPasswordToken -resetPasswordExpires -verificationCode');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json({
            message: "User retrieved successfully",
            user: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving user",
            error: error.message
        });
    }
};

// Update user information
export const editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: "Cannot edit admin user" });
        }

        if (req.file) {
            if (user.image) {
                try {
                    await fs.unlink(path.join('./uploads', user.image));
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            user.image = req.file.filename;
        }

        const updateFields = ['name', 'email', 'phone'];
        updateFields.forEach(field => {
            if (req.body[field]) {
                user[field] = req.body[field];
            }
        });

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 8);
        }

        await user.save();

        await transporter.sendMail({
            from: 'ihrissanek@gmail.com',
            to: user.email,
            subject: templates.emails.ProfileUpdated(user).subject,
            text:  templates.emails.ProfileUpdated(user).text
        });

        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                image: user.image
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating user",
            error: error.message
        });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: "Cannot delete admin user" });
        }

        if (user.image) {
            try {
                await fs.unlink(path.join('./uploads', user.image));
            } catch (err) {
                console.error('Error deleting user image:', err);
            }
        }

        await transporter.sendMail({
            from: 'ihrissanek@gmail.com',
            to: user.email,
            subject: 'Account Deleted',
            text: `Hello ${user.name}, your account has been deleted successfully.`
        });

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            message: "User deleted successfully",
            deletedUser: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting user",
            error: error.message
        });
    }
};



// Verify email with verification code
export const verifyEmail = async (req, res) => {
    const { email,verificationCode } = req.body;
    console.log("email",email);
    console.log("verifCode",verificationCode);

    try {
        const user = await User.findOne({ email });
        if (!verificationCode) return res.status(400).json({ message: "Invalid verification code" });
        if (!user) return res.status(400).json({ message: `user with email ${email} not found`});

        user.verified = true;
        await user.save();
        sendAdminNotification(templates.notifications.adminNotification(user).subject,templates.notifications.adminNotification(user).text);
        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select('-password -verificationCode');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            user: user 
        });
    } catch (error) {
        console.error("CheckAuth error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error checking authentication", 
            error: error.message 
        });
    }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No account with that email found.' });

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();
        const resetLink = `https://teamwork-project.vercel.app/reset-password/${token}`;
        const mailOptions = {
            to: user.email,
            from: 'ihrissanek@gmail.com',
            subject: 'Password Reset Request',
            text: `Click on the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset email sent successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Find the user with the reset token and check if it's expired
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });

        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined; // Clear the reset token
        user.resetPasswordExpires = undefined; // Clear the expiration

        await user.save();
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Admin grants or denies user access
export const acceptAccess = async (req, res) => {
    const userId = req.params.id;
    try {
        if(!userId){
            return res.status(404).json({ message: 'absence of userID' })

        }
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const accessLink = `https://teamwork-project.vercel.app/login`;
        user.isAccessGranted = true;
        await user.save();
        await transporter.sendMail({
            from: 'ihrissanek@gmail.com',
            to: user.email,
            subject:templates.emails.welcomeEmail(user,accessLink).subject,
            text:templates.emails.welcomeEmail(user,accessLink).text
        });
        res.status(200).json({ message: 'Access granted and email sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const denyAccess = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isAccessGranted = false;
        await user.save();

        // Send the email notification
        await transporter.sendMail({
            from: 'ihrissanek@gmail.com',
            to: user.email,
            subject: 'Access Denied',
            text: `Hello ${user.name}, your access request has been denied.`
        });

        res.status(200).json({ message: 'Access denied and email sent.' });
    } catch (error) {
        console.error('Error in denyAccess:', error.message);
        res.status(500).json({ message: error.message });
    }
};
