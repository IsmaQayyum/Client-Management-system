const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const watchCollection = require("./utils/watchCollection");
const clientBillRoutes = require('./routes/clientBillRoutes');

const companyRoutes = require("./routes/company.js");
const secpRoutes = require("./routes/secpRoutes");
const buttonRoutes = require("./routes/buttonsRoutes.js");
const companyDetailsRoutes = require("./routes/companyDetailsRoutes");
const dtsRoutes = require("./routes/dtsRoutes");
const billRoutes = require("./routes/billRoutes");
const clientsSecpRoutes = require('./routes/clientsSecpRoutes');
const ClientsDtsRoutes = require("./routes/ClientsDtsRoutes");
const clientRoutes = require("./routes/clientRoutes"); 
const clientsDetailsRoutes = require("./routes/clientsDetailsRoutes.js");
const clientCategoryRoutes = require("./routes/clientCategoryRoutes");
const fullReportRoutes = require("./routes/fullReportRoutes");

const clientReportRoutes = require("./routes/clientReportRoutes"); 

const { router } = require('./exportToExcel');
const XLSX = require("xlsx");



const Company = require("./models/Company.js");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/companies", companyRoutes);
app.use("/api", billRoutes);
app.use("/api/dts", dtsRoutes);
app.use("/api/secp", secpRoutes);
app.use("/api/buttons", buttonRoutes);
app.use("/api/companyDetails", companyDetailsRoutes);
app.use("/api/client-bills", clientBillRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api", clientsDetailsRoutes);
app.use('/api/clientsSecp', clientsSecpRoutes);
app.use('/api/clientsDts', ClientsDtsRoutes);
app.use("/api/clients", clientCategoryRoutes);
app.use("/api/full-report", fullReportRoutes);
app.use("/api", clientReportRoutes);

app.use('/api', router);

watchCollection();

app.post("/api/clientBills", (req, res) => {
  console.log("📥 Incoming request to /api/clientBills:", req.body);
  res.status(200).send("Received!");
});


app.get("/api/companyDetails/:id", async (req, res) => {
  const { id } = req.params;
  const company = await CompanyDetails.findById(id);
  if (!company) {
      return res.status(404).json({ error: "Company not found" });
  }
  res.json(company);
});




app.post("/api/clientBills", async (req, res) => {
  try {
    const newBill = new ClientBill(req.body); 
    await newBill.save();
    res.status(201).json({ bill: newBill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/full-report/:companyId", async (req, res) => {
  try {
      const company = await Company.findOne({ companyId: req.params.companyId });
      const bill = await Bill.findOne({ companyId: req.params.companyId }); // ✅ Ensure Bill Data is fetched

      if (!company) {
          return res.status(404).json({ error: "Company not found" });
      }

      res.json({
          companyDetails: company,
          bill: bill || { amounts: {}, totalAmount: 0, receivedAmount: 0, balance: 0, receivedDate: "" }, // ✅ Default Empty Bill
      });
  } catch (error) {
      console.error("Error fetching full report:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/api/companyDetails", (req, res) => {
  console.log("🔍 Received Data:", req.body);
  if (!req.body.companyName || !req.body.companyId) {
      return res.status(400).json({ error: "companyName and companyId are required!" });
  }
 
});
app.get("/api/companies/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "No company found" });
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/companies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCompany = await Company.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(updatedCompany);
  } catch (error) {
    console.error("❌ Error updating company:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.put("/api/companies/:id/add-client", async (req, res) => {
  const { clients } = req.body;
  const { id } = req.params;

  if (!Array.isArray(clients)) {
    return res.status(400).json({ error: "Clients must be an array" });
  }

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    company.clients = clients;
    await company.save();
    res.json(company);
  } catch (error) {
    console.error("❌ Error updating clients:", error);
    res.status(500).json({ error: "Error updating clients", details: error.message });
  }
});

app.put("/api/companies/:id/delete-client", async (req, res) => {
  const { id } = req.params;
  const { clients } = req.body;

  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { clients: clients },
      { new: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json({ message: "Client deleted successfully", company: updatedCompany });
  } catch (error) {
    console.error("❌ Error deleting client:", error);
    res.status(500).json({ error: "Error deleting client", details: error.message });
  }
});


app.put("/api/company/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    let company = await Company.findById(id);

    if (company) {
      company = await Company.findByIdAndUpdate(id, data, { new: true });
    } else {
      company = new Company({ _id: id, ...data });
      await company.save();
    }

    res.status(200).json(company);
  } catch (error) {
    console.error("❌ Error updating/creating company:", error);
    res.status(500).json({ message: error.message });
  }
});
app.post("/api/clients-details/:id", async (req, res) => {
  try {
      const clientId = req.params.id;
      const clientData = req.body;

    
      if (!clientId) {
          return res.status(400).json({ error: "Client ID is required" });
      }

      res.status(200).json({ message: "Client details saved successfully!" });
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
