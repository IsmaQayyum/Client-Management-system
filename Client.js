const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    name: String,
    companyId: String,
    details: { type: mongoose.Schema.Types.ObjectId, ref: "ClientsDetails" } // Ensure this exists
  });
  

// ✅ Prevent OverwriteModelError
const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);

module.exports = Client;
