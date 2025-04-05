const mongoose = require('mongoose');

const secpSchema = new mongoose.Schema({
    companyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Company", 
        required: true, 
        unique: true, 
    },
    secpId: { type: String, required: true, unique: true }, 
    electOfDir: { type: String },
    nextElection: { type: Date },
    authorizedCapital: { type: String },
    paidUpCap: { type: String },
    auditor: { type: String },
    appointmentDate: { type: Date },
    formA: { type: String },
    form9: { type: String },
    form19: { type: String }
}, { timestamps: true });

const Secp = mongoose.models.SECP || mongoose.model('SECP', secpSchema);

module.exports = Secp;
