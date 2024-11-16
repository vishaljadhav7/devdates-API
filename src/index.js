require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./config/database')
const user = require('./models/user.model')

app.use(express.json())

app.post('/signup', async (req, res) => {
    try{
        const newUser = new user({...req.body})
        console.log(newUser)
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
    const allUsers = await  user.find({})  
  
    res.json(allUsers)
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
