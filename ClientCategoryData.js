const mongoose = require("mongoose");

const ClientCategorySchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  category: { type: String, required: true }, 
  reg: { type: String, default: "" },
  id: { type: String, default: "" },
  pin: { type: String, default: "" },
  password: { type: String, default: "" },
  email: { type: String, default: "" },
  mobile: { type: String, default: "" },
}, { timestamps: true }, { collection: 'clientcategories' });


const ClientCategoryData = mongoose.models.ClientCategoryData || mongoose.model("ClientCategoryData", ClientCategorySchema);

module.exports = ClientCategoryData;
