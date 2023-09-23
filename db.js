const mongoose = require('mongoose');
// const mongoURI = "mongodb://127.0.0.1:27017/taleDB";

const mongoURI = "mongodb+srv://admin-adarsh:mongoDB-pswd@cluster0.3cwun6d.mongodb.net/taleDB";

const connectMongo = ()=>{
    mongoose.connect(mongoURI);
    };


module.exports=connectMongo;
