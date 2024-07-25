const mongoose = require("mongoose")

const auditLogsSchema = mongoose.Schema({
  email: { type: String, required: true },
  level: String,
  location: String,
  proc_type: String,
  log: String,
}, {
  timestamps:
    { createdAt: "created_at", updatedAt: "updated_at" }
});

class AuditLogs extends mongoose.Model {

}

auditLogsSchema.loadClass(AuditLogs);

module.exports = mongoose.model("AuditLog", auditLogsSchema)