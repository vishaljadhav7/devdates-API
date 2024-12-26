const express = require('express');  
const app = express();

const cookieParser = require('cookie-parser');
const cors = require("cors");

app.use(
  cors({
    origin: ['http://localhost:5173'], // Explicitly allow your frontend origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

const authRouter = require('./routes/auth.routes') 
const userProfileRouter = require('./routes/profile.routes')
const requestRouter = require('./routes/request.routes')
const userRouter = require('./routes/user.routes')
const messageRouter = require('./routes/message.routes');

app.use(express.json());
app.use(cookieParser()) ;

app.use('/auth', authRouter)
app.use('/profile', userProfileRouter) 
app.use('/request', requestRouter)
app.use('/user', userRouter)
app.use('/chat', messageRouter);



module.exports = app;