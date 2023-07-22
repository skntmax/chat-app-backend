import mongoose from 'mongoose'
import {Schema} from 'mongoose'
let connectUrl = `mongodb+srv://skntmax:sknt987@blog-cluster.qewamek.mongodb.net/chatapp?retryWrites=true&w=majority`
let conn;
 
 
(async function() {
    try{
          conn = await mongoose.connect(connectUrl ,{ useNewUrlParser: true, useUnifiedTopology: true , })
           console.log(" db connected ");   
     }catch(err){ 
          throw new Error(err)
       }
})()   
 
export { conn }