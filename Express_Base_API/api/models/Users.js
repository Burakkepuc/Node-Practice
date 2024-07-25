const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  is_active: Boolean,
  first_name: String,
  last_name: String,
  phone_number: String
}, {
  timestamps:
    { createdAt: "created_at", updatedAt: "updated_at" }
});

class Users extends mongoose.Model {

}

userSchema.loadClass(Users);

module.exports = mongoose.model("User", userSchema)