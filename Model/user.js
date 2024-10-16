const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    password: { type: String, required: true },  // Pas besoin de unique ici
    email: { type: String, required: true, unique: true },
    nom: { type: String, required: true },       // Pas unique
    prenom: { type: String, required: true },    // Pas unique
    role: { type: Number, required: true },      // Pas unique
    document: { type: String, required: true },  // Pas unique
});

module.exports = mongoose.model('User', userSchema);
