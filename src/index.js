require('dotenv').config()

const express = require('express')  
const app = express()
const PORT = Number(process.env.PORT || 3001)
const cookieParser = require('cookie-parser')  
const connectDB = require('./config/database')
  

const authRouter = require('./routes/auth') 
const profileRouter = require('./routes/profile')


app.use(express.json())
app.use(cookieParser()) 

app.use('/', authRouter)
app.use('/', profileRouter) 




 
connectDB().then(()=>{
    console.log("DB connection established")
    app.listen(PORT , ()=> {
      console.log("server listening on port 3000 ")   
    }) 
}) 
.catch((err) => {
    console.log("DB connection failed : ", err.message)
})
           