const mongoose = require('mongoose');

const dtsSchema = new mongoose.Schema({
    companyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Company",  
        required: true, 
        unique: true, 
    },
    dtsReg: { type: String },
    dtsId: { type: String },
    dtsPin: { type: String },
    dtsPass: { type: String },
    dtsMail: { type: String },
    dtsMobile: { type: String },
    dtsExpiry: { type: Date },
    dtsBgEx: { type: Date }
}, { timestamps: true });

// Ensure the model is not recompiled
const DTS = mongoose.models.DTS || mongoose.model("DTS", dtsSchema);

module.exports = DTS;
