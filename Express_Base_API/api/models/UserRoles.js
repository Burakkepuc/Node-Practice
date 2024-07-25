const mongoose = require("mongoose")

const userRolesSchema = mongoose.Schema({
  role_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
  user_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
}, {
  timestamps:
    { createdAt: "created_at", updatedAt: "updated_at" }
});

class UserRoles extends mongoose.Model {

}

userRolesSchema.loadClass(UserRoles);

module.exports = mongoose.model("UserRole", userRolesSchema)