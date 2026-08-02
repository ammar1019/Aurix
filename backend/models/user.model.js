// we will include all stuff in this model , no need to create a seperate model for assistant 
// first we create the schema then the model 
import mongoose from "mongoose";


const userSchema  = new mongoose.Schema({
    name : {
        type : String , 
        required : true 
    } , 
    email : {
        type : String ,
        required : true , 
        unique : true 
    } , 
    password : {
         type : String , 
        required : true 
    } , 
    assistantName : {
        type : String 
    } , 
    assistantImage : {
        type : String 
    } , 
    history : [
        {type : String  }
    ]  // to store all the chats the user has had 
} , {timestamps: true })


// now create the model using this schema 
const User = mongoose.model("User" , userSchema) ; 
export default User ; 