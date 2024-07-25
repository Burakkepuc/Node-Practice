const mongoose = require("mongoose")

const roleSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  is_active: { type: String, required: true },
  first_name: String,
  last_name: String,
  phone_number: String
}, {
  timestamps:
    { createdAt: "created_at", updatedAt: "updated_at" }
});

class Roles extends mongoose.Model {

}

roleSchema.loadClass(Roles);

module.exports = mongoose.model("Role", roleSchema)