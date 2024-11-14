import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique:true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        unique:true
        
    },
    image: {
        type: String,
        required:false,  
    },
    role: {
        type: String,
        default:"User",
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

export const User = mongoose.model('User', userSchema);
