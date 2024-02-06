const mongoose = require('mongoose');
const postschema = new mongoose.Schema({
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  title: String,
  description: String,
  Image: String
})

const post = mongoose.model('post', postschema);

module.exports = post;
