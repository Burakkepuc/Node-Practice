const mongoose = require("mongoose")
const Permissions = require('../models/Permissions')
const roleSchema = mongoose.Schema({
  role_name: { type: String, required: true, unique: true },
  is_active: { type: Boolean, required: true },
  created_by: { type: mongoose.SchemaTypes.ObjectId }
}, {
  timestamps:
    { createdAt: "created_at", updatedAt: "updated_at" }
});

class Roles extends mongoose.Model {
  static async remove(query) {
    if (query._id) {
      Permissions.remove({ role_id: query._id })
    }

    await super.remove(query)
  }
}

roleSchema.loadClass(Roles);

module.exports = mongoose.model("Role", roleSchema)