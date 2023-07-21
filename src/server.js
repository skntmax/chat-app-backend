import express from "express";
import "dotenv/config";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { createServer } from "http";

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

const httpServer = createServer(app);
 
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
 
});
// io.origins('*:*');
 

io.on("connection", (socket) => {
  console.log(` ${socket.id} id connected to socket `);

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
