const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/taleDB";

const connectMongo = ()=>{
    mongoose.connect(mongoURI);
    };


module.exports=connectMongo;