const express=require('express');
const bcrypt=require('bcrypt');
const User = require('../Model/user');
const router = express.Router();
const path = require('path');
const dotenv = require('dotenv');

router.get('/users', async (req,res)=>{
try{
    const users=await User.find();

    res.render('users', { users }); 
}catch(err){
    console.log(err);
    res.status(500).send('Error retrieving users');
}


})
