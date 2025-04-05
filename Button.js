const mongoose = require("mongoose");

const buttonSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    group: {
        type: String,
        required: true
    },
    data: {
        reg: { type: mongoose.Schema.Types.Mixed, default: "" },   
        id: { type: mongoose.Schema.Types.Mixed, default: "" },    
        pin: { type: mongoose.Schema.Types.Mixed, default: "" },   
        password: { type: mongoose.Schema.Types.Mixed, default: "" },
        email: { type: mongoose.Schema.Types.Mixed, default: "" },
        mobile: { type: mongoose.Schema.Types.Mixed, default: "" }
    }
}, { timestamps: true });

const Button = mongoose.models.Button || mongoose.model("Button", buttonSchema);

module.exports = Button;
