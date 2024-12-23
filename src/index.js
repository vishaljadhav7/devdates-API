require('dotenv').config()

const app = require('./app')
const PORT = Number(process.env.PORT || 3001)
const connectDB = require('./config/database')
 
connectDB().then(()=>{
    console.log("DB connection established")
    app.listen(PORT , ()=> {
      console.log("server listening on port 3000 ")   
    }) 
}) 
.catch((err) => {
    console.log("DB connection failed : ", err.message)
})
           