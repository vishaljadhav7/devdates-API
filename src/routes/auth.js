const express = require('express')
const authRouter = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user.model')

const {validateSignUpData} = require('../utils/validation')

const saltRounds = 10;

/*
  ##) For sign up
    -> validate sign up data
    -> extract credentials
    -> hash plaintext password
    -> save user info

  ##) For sign in
    -> check if the email is in our DB
    -> if email exist, compared the user's password with hashed password using bcrypt 
    -> if matches then generate token with JWT & sent it to user by wrapping it in cookie 

*/ 

authRouter.post('/auth/signup', async (req, res) => {
   try { 
       validateSignUpData(req)

       const {firstName, lastName, emailId, password} = req.body;
    
       const hashedPassword = await  bcrypt.hash(password, saltRounds);

       const newUser = new User({
        firstName, lastName, emailId, password : hashedPassword
       }); 

       await newUser.save();

       res.status(200).json({
        message : "user signed up successfully"
       })
 
   } catch (error) {
      res.status(400).json({
        message : "Error " + error.message
      }) 
   }
     
})

authRouter.post('/auth/signin', async (req, res) => {
  try {
    const {emailId , password} = req.body;

    const userInfo = await User.findOne({emailId});
    
    if(!userInfo) throw new Error("invalid credentials");

    const isPasswordValid = await userInfo.validatePassword(password);     
     
    if(!isPasswordValid) throw new Error("invalid credentials");

    const token = await userInfo.generateJWT();
    
    res.cookie('token', token, {expires : new Date( Date.now() + 3600000)})

    res.status(200).json({
        message : "sign in successful",
        userInfo
      })
     
  } catch (error) {
    
    res.status(404).json({
        message : "Error " + error.message
      }) 
  }

})


authRouter.get('/auth/signout', async (req, res) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout Successful!!");
  })
  

module.exports = authRouter;