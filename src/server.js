import express from "express";
import "dotenv/config";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { createServer } from "http";
import FCM from 'fcm-node'
import fs, { createReadStream, readFile } from 'fs'
import { conn } from './database/connection.js'
import db_tokens from "./database/models.js";
// import { getMessaging } from "firebase/messaging";


const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static(path.join(__dirname, "../html")));
app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app.use(express.json())
app.get("/", (req, res) => {
  res.sendFile("index.html", (err) => {
    console.log("some error ");
  });
});



app.post("/push-notification/:token/:username", (req, res) => {
  try{

     let {token ,username } = req.params

      let create= new db_tokens({token:token , username:username })
      create.save().then(()=> console.log("data saved "))
      
     //    let all_token = []
  //    fs.readFile(__dirname+'/fb_tokens.json' , 'utf8', (err, data ) =>{
  //      if( err) throw new Error('not able to read file ') 
  //      all_token = JSON.parse(data) 
  //    })
  
  //    let f_tokens = [...all_token , token]
  //    fs.writeFile(__dirname+'/fb_tokens.json',JSON.stringify(f_tokens), (err) => {
  //      if (err) throw err;
  //      console.log('Data written to file');
  //  });


     var serverKey = "AAAAD-QLCwE:APA91bHGzmiEvSnrsbSCDqIBDICsIAG6lScXWt924rg1a9-aWgRBFYygfO11gosQLtlsXrk_IuokFxjp2vTYQAbZQmFpSuYbRnX6I9YuvApXEjE3Tbn5z5OAdecxRbAkmkocy9slDR5o"; //put your server key here
     var fcm = new FCM(serverKey);
      
     var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
         to: token, 
         collapse_key: 'your_collapse_key' ,
         notification: req.body , 
         data: {  //you can send only notification or only data(or include both)
             my_key: 'my value',
             my_another_key: 'my another value'
         }

     };
      
     
     fcm.send(message, function(err, response){
         
        if (err) {
           console.log(err);
             console.log("Something has gone wrong!" ,);
             res.send({
              status:false 
             })
         } else {
             console.log("Successfully sent with response: ", response);
             res.send({
              status:true,
              result:response
             })
         }

     });





    
  } catch(err){
      console.log("err" , err );
      res.send(err)
  } 
 
    
});

























app.get('/readfile',(req, res )=>{
  
    let all_token = []
    fs.readFile(__dirname+'/fb_tokens.json' , 'utf8', (err, data ) =>{
      if( err) throw new Error('not able to read file ') 
      all_token = JSON.parse(data) 
    })
 

    let f_tokens = [...all_token , "something data"]
    fs.writeFile(__dirname+'/fb_tokens.json',JSON.stringify(f_tokens), (err) => {
      if (err) throw err;
      console.log('Data written to file');
  });

  res.send({
    res:true
  })
})




app.get("/push-notification-test/", (req, res) => {
  try{

     var serverKey = "AAAAD-QLCwE:APA91bHGzmiEvSnrsbSCDqIBDICsIAG6lScXWt924rg1a9-aWgRBFYygfO11gosQLtlsXrk_IuokFxjp2vTYQAbZQmFpSuYbRnX6I9YuvApXEjE3Tbn5z5OAdecxRbAkmkocy9slDR5o"; //put your server key here
     var fcm = new FCM(serverKey);
 
     var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
         to: 'eNs9k1NnV-Wmnp97aTwSfI:APA91bFXzSNCdyZvcc1Sis9jqzSPHV_0wMOaptQ9vBtMKl9EKuE0jx5cWa4pxvlLAMQvhhAM-vYHBkE9AG0N-OxGNnkj9SYr--ejvQ6ihbccwg7Md2VdCybkVHWFJDwktJz2zH2PaDXP', 
         collapse_key: 'your_collapse_key',
         notification:  {
          title: 'hi there , let\'s have som rasili baatein ',
          body: 'kundi mat khadkaao raaja seedha andr aao raaja '
        } , 
         data: {  //you can send only notification or only data(or include both)
             my_key: 'my value',
             my_another_key: 'my another value'
         }

     };
      
     
     fcm.send(message, function(err, response){
         
        if (err) {
           console.log(err);
             console.log("Something has gone wrong!" ,);
         } else {
             console.log("Successfully sent with response: ", response);
             res.send({
              status:true,
              result:response
             })   
         }
     });



    
  } catch(err){
      console.log("err" , err );
      res.send(err)
  } 
 
    
});































const httpServer = createServer(app);
 
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
 
});
// io.origins('*:*');
 



io.on("connection", (socket) => {
  console.log(` ${socket.id} id connected to socket `);
   
   

  socket.on('get-count', ()=>{
       const count = io.engine.clientsCount;
           socket.emit("get-count" , count  )
  })
   
  socket.on("group-message", (data) => {
        //  socket.broadcast.emit('group-message-to-all' ,  data)
      
         io.emit('group-message-to-all' ,  data)
    }); 
    

    socket.on('room-message' ,(messages , room )=>{ 
       
      io.to(room).emit('room-message' , messages)
     })
      

    socket.on("disconnect", () => {
      console.log("Client disconnected" );
    });
  
   
});

 
httpServer.listen(process.env.PORT, () => {
  console.log(`server connected at ${process.env.PORT}`);
});
