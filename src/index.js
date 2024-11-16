const express = require('express')
const app = express()

app.use("/test", (req,res) => {
    res.send(" route /test")
})
app.use("/hey" , (req,res) => {
    res.send(" route /hey")
})

app.use('/route1',(req,res) => {
    res.send(" route /route1")
} )


app.use('/route2',(req,res) => {
    res.send(" route /route2")
} )



app.use("/", (req,res) => {
    res.send("main route /")
})





app.listen(3000, ()=> {
  console.log("server listening on port 3000")   
})