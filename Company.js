const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyName: { type: String, required: true, trim: true }, 
    repName: { type: String, required: true, trim: true }, 
    details: { type: mongoose.Schema.Types.ObjectId, ref: "CompanyDetails", default: null },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }], 
}, { timestamps: true });


const Company = mongoose.modelNames().includes("Company") 
    ? mongoose.model("Company") 
    : mongoose.model("Company", companySchema);

module.exports = Company;
