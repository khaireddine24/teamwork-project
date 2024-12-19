import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/routes.js';
import { dbConnect } from './config/dbConnect.js';

dotenv.config();

// Get current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to the database
dbConnect();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes prefix
app.use("", routes);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});