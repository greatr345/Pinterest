const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/userregisteration")
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  profileImage: String,
  password: {
    type: String,
  },
  Posts:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"post"
    }
  ]
});

userSchema.plugin(plm)

const User = mongoose.model('User', userSchema);

module.exports = User;
