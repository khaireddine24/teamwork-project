import mongoose from "mongoose"; 
import { Supplier } from "./Supplier.js";
import { ItemLine } from "./ItemLine.js";

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
