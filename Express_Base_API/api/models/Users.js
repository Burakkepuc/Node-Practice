const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const is = require('is_js');
const CustomError = require("../lib/Error");
const { HTTP_CODES } = require("../config/Enum");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  first_name: String,
  last_name: String,
  phone_number: String
}, {
  versionKey: false,
  timestamps:
    { createdAt: "created_at", updatedAt: "updated_at" }
});

class Users extends mongoose.Model {

  validPassword(password) {
    return bcrypt.compareSync(password, this.password)
  }

  static validateFieldsBeforeAuth(email, password) {
    if (typeof password !== 'string' || password.length < 6 || is.not.email(email)) {
      throw new CustomError(HTTP_CODES.UNAUTHORIZED, "Validation Error", "email or password wrong")
    }
    return null
  }
}

userSchema.loadClass(Users);

module.exports = mongoose.model("User", userSchema)