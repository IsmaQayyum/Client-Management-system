const mongoose = require('mongoose');

const ClientBillSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    amounts: {
        audit: String,
        MonthlySaleTaxRetrn: String,
        fbr: String,
        pra: String,
        srb: String,
        iata: String,
        pseb: String,
        kpra: String,
        bra: String,
        pec: String,
        wht: String,
        dts: String,
        secp: String
      },
      
    totalAmount: Number,
    receivedAmount: String,
    balance: Number,
    receivedDate: String
}, { timestamps: true });

const ClientBill = mongoose.models.ClientBill || mongoose.model('ClientBill', ClientBillSchema);

module.exports = ClientBill;
