import mongoose from 'mongoose'
import { Schema } from 'mongoose'

let db_tokens = mongoose.model('token', Schema({
     createdOn:{
         Type:String ,
     },
     token:String,
     username:String
}))  


export default db_tokens