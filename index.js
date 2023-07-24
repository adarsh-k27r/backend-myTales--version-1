require('dotenv').config();
const connectMongo = require("./db");
const express = require('express');
var cors = require('cors');

connectMongo();

const app=express();
const port=5000;

app.use(express.json());
app.use(cors());

app.use("/api/auth",require('./routes/auth'));
app.use("/api/blog",require('./routes/blog'));

app.listen(port,()=>{
    console.log(`Server connected at http://localhost:${port}`);
});