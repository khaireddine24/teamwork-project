import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default:0
        
    },
    
    

    
});

export const Article = mongoose.model('Article', articleSchema);
