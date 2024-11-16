import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    niche: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    }
});

// Correct way to create and export the model
export const Supplier = mongoose.model('Supplier', userSchema);
