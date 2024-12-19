import mongoose from "mongoose"; 

const CommandeSchema = new mongoose.Schema({
    dateCommande: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    dateLivraison: {
        type: String,
        required: true,
    },
    is_allowed:{
        type:Boolean,
        required:true,
        default:0,
    },
    ItemLines: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ItemLine", 
            required: true,
        },
    ],
    Suppliers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier", 
            required: true,
           
        },]
});

// Export the Commande model
export const Commande = mongoose.model("Commande", CommandeSchema);
