const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        
    },
    image: {
        type: String,
        required:false,  
    },
    role: {
        type: String,
        required: true,
    },
    verificationCode: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
    isAccessGranted:{
        type: Boolean,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    
});

module.exports = mongoose.model('User', userSchema);
