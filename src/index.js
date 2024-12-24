require('dotenv').config()

const http = require('http');
const app = require('./app')
const PORT = Number(process.env.PORT || 3001)
const connectDB = require('./config/database')
 
const httpServer = http.createServer(app);

connectDB().then(()=>{
    console.log("DB connection established")
    httpServer.listen(PORT , ()=> {
      console.log("server listening on port 3000 ")   
    }) 
}) 
.catch((err) => {
    console.log("DB connection failed : ", err.message)
})
           