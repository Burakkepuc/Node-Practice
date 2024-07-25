const mongoose = require("mongoose")

const categoriesSchema = mongoose.Schema({
  is_active: { type: Boolean, default: true },
  created_by: { type: mongoose.SchemaTypes.ObjectId, required: true }
}, {
  timestamps:
    { createdAt: "created_at", updatedAt: "updated_at" }
});

class Categories extends mongoose.Model {

}

categoriesSchema.loadClass(Categories);

module.exports = mongoose.model("Category", categoriesSchema)