const express = require("express");
const mongoose = require("mongoose")

const app = express();

// Connect MongoDB

const connect = () => {
    //mongodb url
 return mongoose.connect("mongodb://localhost:27017/test")
}



// create Schema - basically a structure of our document
const userSchema = mongoose.Schema({
    first_name : String,
    last_name : String,
    email : String,
    gender : String,
    password : String,
    ip_address : String,
})

// Model

// users - user
const User = mongoose.model("user", userSchema)
//  db.user


app.get("/users", async (req,res) => {
    const userData = await User.find({},{first_name:1, _id : 0}).lean().exec();
   
    return res.send(userData)
})


app.listen(4321,async() => {
    try{
        await connect();
        console.log("listening at 4321")
    }
    catch(e){
        console.log(e)
    }
       
})