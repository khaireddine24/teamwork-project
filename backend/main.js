import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/routes.js';
import { dbConnect } from './config/dbConnect.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to the database
dbConnect();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'secret123',
    saveUninitialized: true,
    resave: false,
  })
);
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Routes prefix
app.use("", routes);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
