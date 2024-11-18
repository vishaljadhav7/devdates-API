require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./config/database')
const user = require('./models/user.model')

app.use(express.json())

app.post('/signup', async (req, res) => {
    try{
        const newUser = new user({...req.body})
        await newUser.save()
        res.send("user added succesfully") 
    }
    catch(err){
        res.status(400).json({
            message : err.message
        })
    }
})


app.get('/feed', async (req, res) => {

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



connectDB().then(()=>{
    console.log("DB connection established")
    app.listen(process.env.PORT , ()=> {
      console.log("server listening on port 3000 ")   
    }) 
})
.catch((err) => {
    console.log("DB connection failed : ", err.message)
})
