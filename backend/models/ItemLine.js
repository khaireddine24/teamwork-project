import mongoose from "mongoose";
import { type } from "os";
import { Article } from "./Article.js";
import { text } from "stream/consumers";

const articleSchema = new mongoose.Schema({
    Articles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article", // Ensure this matches the name of your Article model
        required: true,
    },
    UnitPrice: {
        type: Number,
        required:true
        
    },
    Totalprice: {
        type: Number,
        
    },
    quantity: {
        type: Number,
        default:0
        
    },
    Taxes:{
        type:Number,
        default:0
    },
    UOM:{
        type:String,
        default:"kg"
    }
    
    
    

    
});

export const ItemLine = mongoose.model('ItemLine', articleSchema);
