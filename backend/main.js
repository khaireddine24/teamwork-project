import dotenv from 'dotenv';
import express from 'express';
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
const PORT = process.env.PORT || 5000;

// Connect to the database
dbConnect();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.use(cors({ origin: "https://teamwork-project.vercel.app", credentials: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes prefix
app.use("", routes);

app.use("/",(req,res)=>{
  res.status(404).json({message: "Route not found"})
})

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});