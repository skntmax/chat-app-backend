const { log } = require('console')
const express = require('express')
const path  = require('path')
require('dotenv').config()
let app = express()

let server =app.listen(process.env.PORT , ()=> console.log("server connected at port 2222") )

app.use(express.static(path.join(__dirname, "../html")));
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile("index.html", (err) => {
      console.log("some error ");
    });
  });



let io =require('socket.io')(server ,{
    pingTimeOut:60000,
    cors:{
        origin:"http://localhost:3000"
    }
}) 

 
 
io.on('connection' ,(socket)=>{
     console.log(`socket intialised  ${socket.id}`);
  socket.emit("server-message" ,{
        name:"skntmax"
  })


  socket.on('sendMessage' ,(data)=>{
      log(data)
  })

     socket.on("disconnect", () => {
        console.log("Client disconnected" );
      });
    

})

