const mongoose = require("mongoose")

const categoriesSchema = mongoose.Schema({
  name: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  created_by: { type: mongoose.SchemaTypes.ObjectId }
}, {
  timestamps:
    { createdAt: "created_at", updatedAt: "updated_at" }
});

class Categories extends mongoose.Model {

}

categoriesSchema.loadClass(Categories);

module.exports = mongoose.model("Category", categoriesSchema)