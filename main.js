//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app= express();
const PORT = process.env.PORT || 4000;

//how to connect to data base 

mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", ()=>console.log("connected to the data base"));

//middlewares
/*
-Form Submission Handling: express.urlencoded() processes URL-encoded data from forms, making it
available in req.body.
-JSON Data Handling: express.json() processes incoming JSON data from API requests and attaches it 
to req.body.
-Session Management: The session middleware enables session support, where user-specific data 
(like login state or messages) can persist between different requests.
-Flash Message Handling: The custom middleware ensures that session messages (stored temporarily)
 are moved to res.locals for display in views and then removed from the session to prevent duplicate display.
*/ 
app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(
    session({
    secret: 'my secret key'
    ,saveUninitialized: true
    ,resave : false
})
);
app.use((req, res, next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

//set template engine
app.set('view engine','ejs');


/*trying to send a message to the browsr
app.get("/", (req,res)=>{
    res.send("hello world");

});*/


//routes prefix
app.use("", require("./routes/routes"));


//The listen() method is used to start the server on a specific port. the port is declared in the .env file
//that i created
app.listen(PORT, ()=>{
    console.log('server started at http://localhost:5000');
});

