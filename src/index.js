require('dotenv').config()

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser') 


const connectDB = require('./config/database')
const user = require('./models/user.model')
const validateSignUpData = require('./utils/validation')
const verifyUser = require('./middlewares/auth')

const saltRounds = 10;


app.use(express.json())
app.use(cookieParser())

app.post('/signup', async (req, res) => {
    try{
        validateSignUpData(req)

        const { firstName, lastName, emailId, password} = req.body;
        
        const passwordHash = await bcrypt.hash(password , saltRounds);

        const newUser = new user({
            firstName, 
            lastName, 
            emailId, 
            password : passwordHash
          });

        await newUser.save()
        res.status(200).json({
          message : "user signed up succesfully"
        }) 
    }
    catch(err){
        res.status(400).json({
            message : "Error"  + err.message
        })
    }
})


app.get('/feed', verifyUser , async (req, res) => {

  try {
    const allUsers = await  user.find({})  
     if(allUsers.length === 0){
        throw new Error("users not found")
     } 
    res.json(allUsers)
  } catch (error) {
    res.status(404).json({
        message : error.message
    })
  }
})

app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const userData = req.body;

  try {
    const ALLOWED_UPDATES = ["photoURL", "about", "gender", "age" , "skills", "lastName"]

    const upatedAllowed = Object.keys(userData).every(key => ALLOWED_UPDATES.includes(key))

    if(!upatedAllowed){
        throw new Error('update not allowed');
    }

    if(userData?.skills?.length > 10){
        throw new Error('skill more than 10 not allowed');
    }

    const updatedUser = await user.findByIdAndUpdate({ _id : userId}, userData , {returnDocument : 'after', runValidators : 'true'} )
     res.status(200).json({
        message : "update success",
        data : updatedUser
     })

  } catch (error) {
    res.status(400).json({
        message : "update not success because " + error.message
     })
  }
})

app.post('/signin', async (req, res) => {
 
  try {
    const {emailId , password} = req.body;
    
    const userInfo = await user.findOne({emailId}) 
    
    if(!userInfo) {
      throw new Error('Invalid credentials')
    }


    const isValidPassword = await userInfo.validatePassword(password)
    
    if(!isValidPassword){
      throw new Error('Invalid credentials')
    }else{

      const token = await userInfo.generateJWT()

      res.cookie('token', token, {expires : new Date( Date.now() + 3600000)})

      res.status(200).json({
        message : "sign in successful",
        userInfo
      })
    }

  } catch (error) {
    res.status(200).json({
      message : "sign in not successful because " + error.message
    })

  }

}) 


app.get('/profile', verifyUser , async (req, res) => {
  try {
    const {userInfo} = req;

    res.status(200).json({
      message : "user profile",
      userInfo
    })

  } catch (error) {
    res.status(400).json({
      message : "ERROR " + error.message
    })

  }
})

app.get('/signout', async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
})

connectDB().then(()=>{
    console.log("DB connection established")
    app.listen(process.env.PORT , ()=> {
      console.log("server listening on port 3000 ")   
    }) 
})
.catch((err) => {
    console.log("DB connection failed : ", err.message)
})
