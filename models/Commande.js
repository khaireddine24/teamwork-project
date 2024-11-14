import mongoose from "mongoose";
import { type } from "os";
const CommandeSchema = new mongoose.Schema({
    dateCommande:{
        type : String,
        required : true,
    },
    status:{
        type : String,
        required : true,
    },
    dateLivraison:{
        type : String,
        required : true,
    },



});
export const Commande = mongoose.model('Commande', CommandeSchema);
