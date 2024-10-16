const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const connectDB = require('./config/connect-mongo');
const authRoutes = require('./routes/auth');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON and URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // This allows you to parse JSON bodies for POST requests

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET, // Your session secret from .env
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // MongoDB URI from .env
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day session expiration
}));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './Views'));  // Ensure the views folder exists

// Routes
app.use('/auth', authRoutes); // Authentication routes

// Basic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
