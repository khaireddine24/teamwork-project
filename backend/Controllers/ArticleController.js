import { Article } from '../models/Article.js';
import nodemailer from 'nodemailer';
import { templates } from '../template/index.js';



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
// get  ALL The articles
export const getAllArticles = async (req, res) => {
    try {const articles = await Article.find().sort({ createdAt: -1 });

        
        res.status(200).json({
            Articles: articles
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving Articles",
            error: error.message
        });
    }
};
// get The article by id
export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        res.status(200).json({
            article: article
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving article",
            error: error.message
        });
    }
};
// add an article 
export const AddArticle = async (req, res) => {
    const { name, description, price, quantity } = req.body;
    try {
        const article = new Article({
            name: name,
            description: description,
            price: price,
            quantity: quantity
        });

        await article.save();
        sendAdminNotification(templates.notifications.articleAddedNotification(article).subject, templates.notifications.articleAddedNotification(article).text);
        res.status(200).json({ message: "Article added successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error",
            error: error.message
        });
    }
};

// delete an article by Id
export const DeleteArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({
                message: "Article not found"
            });
        }

        await Article.findByIdAndDelete(req.params.id);
        await sendAdminNotification(
            templates.notifications.articleDeletedNotification(article).subject,
            templates.notifications.articleDeletedNotification(article).text,
        );
        res.status(200).json({
            message: "Article has been deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting article",
            error: error.message
        });
    }
};
// edit an article by Id
export const editArticle = async (req, res) => {
    try {
        const ArticleId = req.params.id;
        const article = await Article.findById(ArticleId);
        
        if (!article) {
            return res.status(404).json({ message: "article not found" });
        }
        const updateFields = ['name', 'description', 'price','quantity'];
        updateFields.forEach(field => {
            if (req.body[field]) {
                article[field] = req.body[field];
            }
        });

        

        await article.save();
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
