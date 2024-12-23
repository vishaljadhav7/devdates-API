const express = require('express');  
const app = express();

const cookieParser = require('cookie-parser');
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);

const authRouter = require('./routes/auth') 
const userProfileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user')


app.use(express.json())
app.use(cookieParser()) 

app.use('/auth', authRouter)
app.use('/profile', userProfileRouter) 
app.use('/request', requestRouter)
app.use('/user', userRouter)

module.exports = app;