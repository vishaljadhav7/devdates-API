const express = require('express')
const authRouter = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const {validateSignUpData} = require('../utils/validation')

const saltRounds = 10;


authRouter.post('/signup', async (req, res) => {
   try { 
       validateSignUpData(req)

       const {firstName, lastName, emailId, password} = req.body;

       const alreadyResgistered = await User.findOne({emailId})

       if(alreadyResgistered){
        throw new Error("user already registered")
       }
    
       const hashedPassword = await  bcrypt.hash(password, saltRounds);

       const newUser = new User({
        firstName, lastName, emailId, password : hashedPassword
       }); 

       await newUser.save();

       const token = await newUser.generateJWT();

       res.cookie("token", token, {
         expires: new Date(Date.now() + 8 * 3600000),
       });
   
      
      const registeredUser = await User.findById(newUser._id).select('-password'); 

      if(!registeredUser){
        throw new ApiError(500, "Something went wrong while registering the user")
      }

      const options = {
        httpOnly: true,
        secure: true
      }

      const serverResponse = new ApiResponse(200, registeredUser, "User registered Successfully")
      serverResponse.token = token;
      
      return res
      .status(201)
      .cookie("token",token, options)
      .json(serverResponse)

 
   } catch (error) {
    return res
    .status(400)
    .json(new ApiError(error.statusCode, error.message));
   }
     
})

authRouter.post('/signin', async (req, res) => {
  try {
    const {emailId , password} = req.body;

    const user = await User.findOne({emailId});
    
    if(!user) throw new Error("invalid credentials");

    const isPasswordValid = await user.validatePassword(password);     
     
    if(!isPasswordValid) throw new Error("invalid credentials");

    const token = await user.generateJWT();
    
    res.cookie('token', token, {expires : new Date( Date.now() + 3600000)})

    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
      httpOnly: true,
      secure: true
    }


    const serverResponse = new ApiResponse(200, loggedInUser, "User signed in Successfully")
    serverResponse.token = token           
  
    res
    .status(200)
    .cookie("token", token, options)
    .json(serverResponse)

   } catch (error){

    res.status(400).json(
      new ApiError(400, "Error " + error.message))
   }
})


authRouter.post('/signout', async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true
  };
   return res
   .status(200)
   .clearCookie("token", options)
   .json(new ApiResponse(200, {}, "User has logged Out"))

})
  

module.exports = authRouter;