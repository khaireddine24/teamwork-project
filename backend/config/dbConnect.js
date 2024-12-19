import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const db = mongoose.connection;


export const dbConnect = async () => {
    db.on("error", (error) => console.error("MongoDB connection error:", error));
    
    try {
        await mongoose.connect(`mongodb+srv://ihrissanek:uZtkV0UGCnrfcP1X@cluster0.qtaty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`);
        console.log("Connected to the database");
    } catch (err) {
        console.error("Failed to connect to the database:", err);
    }
};
