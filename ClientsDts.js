const mongoose = require('mongoose');

const clientDtsSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    dtsReg: { type: String },
    dtsId: { type: String },
    dtsPin: { type: String },
    dtsPass: { type: String },
    dtsMail: { type: String },
    dtsMobile: { type: String },
    dtsExpiry: { type: Date },
    dtsBgEx: { type: Date }
}, { timestamps: true });


const ClientDTS = mongoose.models.ClientDTS || mongoose.model('ClientDTS', clientDtsSchema);

module.exports = ClientDTS;
