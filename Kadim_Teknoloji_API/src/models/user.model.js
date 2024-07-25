const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  reset: {
    code: {
      type: String,
      default: null
    },
    time: {
      type: String,
      default: null
    }
  }
}, { collection: "User", timestamps: true })
// Validations will make with Joi package

const User = mongoose.model('User', userSchema);

module.exports = User;
