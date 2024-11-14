
import nodemailer from 'nodemailer';
import { templates } from '../template/index.js';
import { Commande } from '../models/commande.js';


const sendAdminNotification = async (subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: '98d772f0f26841',
                pass: '56a1b9eaddd4fb'
            }
        });

        const mailOptions = {
            from: 'thamerkthir@gmail.com',
            to: 'admin@email.com',    
            subject: subject,
            text: typeof message === 'string' ? message : JSON.stringify(message),
        };
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to admin: ${subject}`);
    } catch (error) {
        console.error('Error sending admin notification:', error);
    }
};

// add a commande
export const AddCommande = async (req, res) => {
    const { dateCommande, status, dateLivraison} = req.body;
    try {
        const commande = new Commande({
            dateCommande: dateCommande,
            status:status,
            dateLivraison : dateLivraison,
        });

        await commande.save();

        sendAdminNotification(templates.notifications.commandeAddedNotification(commande).subject, 
        templates.notifications.commandeAddedNotification(commande).text);
        res.status(200).json({ message: "commande added successfully" });
   
   
    } catch (error) {
        res.status(500).json({
            message: "Error",
            error: error.message
        });
    }
};


// get  ALL The commandes
export const getAllCommande = async (req, res) => {
    try {const commande = await Commande.find().sort({ createdAt: -1 });

        
        res.status(200).json({
            Commande:commande
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving commande",
            error: error.message
        });
    }
};


// get The commande by id
export const getCommandeById = async (req, res) => {
    try {
        const commande = await Commande.findById(req.params.id);

        if (!commande) {
            return res.status(404).json({
                message: "commande not found"
            });
        }

        res.status(200).json({
            commande:commande
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving commande",
            error: error.message
        });
    }
};


// delete an commande by Id
export const DeleteCommandeById = async (req, res) => {
    try {
        const commande = await Commande.findById(req.params.id);
        if (!commande) {
            return res.status(404).json({
                message: "commande not found"
            });
        }

        await Commande.findByIdAndDelete(req.params.id);

        await sendAdminNotification(
            templates.notifications.commandeDeletedNotification(commande).subject,
            templates.notifications.commandeDeletedNotification(commande).text,
        );
        res.status(200).json({
            message: "commande has been deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting commande",
            error: error.message
        });
    }
};


// edit a commande by Id
export const editCommande = async (req, res) => {
    try {
        const CommandeId = req.params.id;
        const commande = await Commande.findById(CommandeId);
        
        if (!Commande) {
            return res.status(404).json({ message: "commande not found" });
        }
        const updateFields = [' dateCommande', 'status', 'dateLivraison'];
        updateFields.forEach(field => {
            if (req.body[field]) {
                commande[field] = req.body[field];
            }
        });

        

        await commande.save();
        await sendAdminNotification(
            templates.notifications.articleupdated(article).subject,
            templates.notifications.articleupdated(article).text,
        );

        

        res.status(200).json({
            message: "article updated successfully",
            user: {
                id: article._id,
                name: article.name,
                description: article.description,
                price: article.price,
                role: article.quantity,
             
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating article",
            error: error.message
        });
    }
};
