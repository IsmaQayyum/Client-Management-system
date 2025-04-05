const mongoose = require('mongoose');

const clientsSecpSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true }, 
    secpId: { type: String },
    electOfDir: { type: Date },
    nextElection: { type: Date },
    authorizedCapital: { type: String },
    paidUpCap: { type: String },
    auditor: { type: String },
    appointmentDate: { type: Date },
    formA: { type: Date },
    form9: { type: Date },
    form19: { type: Date }
}, { timestamps: true });


const ClientsSecp = mongoose.models.ClientsSecp || mongoose.model('ClientsSecp', clientsSecpSchema);

module.exports = ClientsSecp;
