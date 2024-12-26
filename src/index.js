require('dotenv').config()

const http = require('http');
const app = require('./app');
const PORT = (process.env.PORT || 3001);
const {createSocketConnection} = require('./socket');
const connectDB = require('./config/database');
 
const httpServer = http.createServer(app);

createSocketConnection(httpServer);

connectDB().then(()=>{
    httpServer.listen(PORT , ()=> {
      console.log("server listening on port 3000 ")   
    }) 
}) 
.catch((err) => {
    console.log("DB connection failed : ", err.message)
});
           