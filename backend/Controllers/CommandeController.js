
import nodemailer from 'nodemailer';
import { templates } from '../template/index.js';
import { Commande } from '../models/Commande.js';


const sendAdminNotification = async (subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: "823395001@smtp-brevo.com",
                pass: "wF8QJDEKOUpAnHLI"
             }
        });

        const mailOptions = {
            from: 'ihrissanek@gmail.com',
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
    const { dateCommande, status, dateLivraison,ItemLines,Suppliers} = req.body;
    try {
        const commande = new Commande({
            dateCommande: dateCommande,
            status:status,
            dateLivraison : dateLivraison,
            ItemLines:ItemLines,
            Suppliers:Suppliers
           

            

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
    }};
    // Assuming you have a `Commande` model, adjust the model name as necessary.
    export const acceptcommande = async (req, res) => {
        const commandeId = req.params.id;
    
        try {
            const commande = await Commande.findById(commandeId);
            if (!commande) {
                return res.status(404).json({ message: 'Commande not found' });
            }
    
            commande.status = "Sent";
            await commande.save();
    
            return res.status(200).json({ message: 'Commande accepted successfully', commande });
        } catch (error) {
            console.error('Error in acceptcommande:', error.message);
            return res.status(500).json({ message: 'Server error: ' + error.message });
        }
    };

        export const denyCommande = async (req, res) => {
            const commandeId = req.params.id;
        
            try {
                const commande = await commande.findOne({ _id: commandeId });
                if (!commande) return res.status(404).json({ message: 'commande is not found' });
        
                commande.is_allowed="false"
                await commande.save();
        
                
            } catch (error) {
                console.error('Error in denyCommande:', error.message);
                res.status(500).json({ message: error.message });
            }}

    

