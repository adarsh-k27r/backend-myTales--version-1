const mongoose = require('mongoose');

const { Schema } = mongoose;

const blogSchema = new Schema({
  user:{
    type : mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: String , // String is shorthand for {type: String}
  body: String ,
  author:String,
  date:{
    type:Date,
    dafault:Date.now

}

},  {timestamps:true}  );


const Blog = mongoose.model('blog',blogSchema);
module.exports=Blog;