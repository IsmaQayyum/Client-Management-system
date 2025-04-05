const mongoose = require('mongoose');

const clientsDetailsSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true }, 
    clientName: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: "" },
    coreg: { type: String, trim: true, default: "" },
    reference: { type: String, trim: true, default: "" },
    status: { type: String, default: "CO" },
    contact: { type: String, trim: true, default: "" },
    repName: { type: String, trim: true, default: "" },
    ntn: { type: String, trim: true, default: "" },
    nic: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
  
}, { timestamps: true });

const ClientsDetails = mongoose.modelNames().includes("ClientsDetails") 
    ? mongoose.model("ClientsDetails") 
    : mongoose.model("ClientsDetails", clientsDetailsSchema);

module.exports = ClientsDetails;
