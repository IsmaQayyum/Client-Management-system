// models/CompanyDetails.js
const mongoose = require('mongoose');

const companyDetailsSchema = new mongoose.Schema({
    companyId: { type: String, required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: "" },
    coreg: { type: String, trim: true, default: "" },
    reference: { type: String, trim: true, default: "" },
    status: { type: String, default: "CO" },
    contact: { type: String, trim: true, default: "" },
    repName: { type: String, trim: true, default: "" },
    ntn: { type: String, trim: true, default: "" },
    nic: { type: String, trim: true, default: "" },
    email: { type: String },

  
}, { timestamps: true });


const CompanyDetails = mongoose.modelNames().includes("CompanyDetails") 
    ? mongoose.model("CompanyDetails") 
    : mongoose.model("CompanyDetails", companyDetailsSchema);

module.exports = CompanyDetails;