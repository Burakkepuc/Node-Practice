const mongoose = require("mongoose")

const permissionsSchema = mongoose.Schema({
  role_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
  created_by: { type: mongoose.SchemaTypes.ObjectId },
  permission: String,
}, {
  timestamps:
    { createdAt: "created_at", updatedAt: "updated_at" }
});

class Permissions extends mongoose.Model {

}

permissionsSchema.loadClass(Permissions);

module.exports = mongoose.model("Permission", permissionsSchema)