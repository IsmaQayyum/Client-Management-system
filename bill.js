const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    amounts: {
        Audit: { type: String, default: "0" },
        MonthlySaleTaxRetrn: { type: String, default: "0" },
        Fbr: { type: String, default: "0" },
        Pra: { type: String, default: "0" },
        Srb: { type: String, default: "0" },
        Iata: { type: String, default: "0" },
        Pseb: { type: String, default: "0" },
        Kpra: { type: String, default: "0" },
        Bra: { type: String, default: "0" },
        Pec: { type: String, default: "0" },
        Wht: { type: String, default: "0" },
        Dts: { type: String, default: "0" },
        Secp: { type: String, default: "0" }
    },
    totalAmount: Number,
    receivedAmount: String,
    balance: Number,
    receivedDate: String
}, { timestamps: true });

// Fix: Prevent model overwriting
const Bill = mongoose.models.Bill || mongoose.model('Bill', BillSchema);

module.exports = Bill;
