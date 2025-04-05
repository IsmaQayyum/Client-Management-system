const mongoose = require("mongoose");  
const SECP = require("../models/Secp");


const generateSECPId = async () => {
    let uniqueId;
    let exists = true;

    while (exists) {
        uniqueId = `SECP-${Math.floor(1000 + Math.random() * 9000)}`;
        exists = await SECP.findOne({ secpId: uniqueId });
    }
    return uniqueId;
};


exports.createOrUpdateSECP = async (req, res) => {
    try {
        let { companyId, secpId, ...updateData } = req.body;

        if (!companyId) {
            return res.status(400).json({ message: "Company ID is required" });
        }

        if (!secpId) {
            secpId = await generateSECPId(); 
            updateData.secpId = secpId; 
        }

        let secpRecord = await SECP.findOneAndUpdate(
            { companyId },
            { ...updateData, companyId, secpId }, 
            { new: true, upsert: true } 
        );

        res.status(200).json({ success: true, data: secpRecord });
    } catch (error) {
        console.error("❌ Error saving SECP data:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


exports.getSECPByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "Invalid Company ID format" });
        }

        let secpRecord = await SECP.findOne({ companyId });

        if (!secpRecord) {
            console.log("⚠️ No SECP record found. Creating a new one...");
            const secpId = await generateSECPId(); // ✅ Generate a unique SECP ID
            secpRecord = await SECP.create({ companyId, secpId }); // ✅ Include secpId
        }

        res.status(200).json({ success: true, data: secpRecord });
    } catch (error) {
        console.error("❌ Error fetching SECP records:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


exports.deleteSECPByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        if (!companyId) {
            return res.status(400).json({ message: "Company ID is required" });
        }

        const deletedSECP = await SECP.findOneAndDelete({ companyId });

        if (!deletedSECP) {
            return res.status(404).json({ message: "SECP record not found" });
        }

        res.status(200).json({ success: true, message: "SECP record deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting SECP record:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
exports.createSECP = async (req, res) => {
    try {
        console.log("📥 Incoming SECP Request Body:", req.body);

        const { companyId, electOfDir, authorizedCapital } = req.body;

        if (!companyId) { 
            return res.status(400).json({ error: "Company ID is required" });
        }

        const newSECP = new SECP({ companyId, electOfDir, authorizedCapital });
        await newSECP.save();

        res.status(201).json({ message: "SECP Created Successfully", data: newSECP });
    } catch (error) {
        console.error("❌ SECP Creation Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getSECPByCompanyId = async (companyId) => {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new Error("Invalid Company ID format");
    }
    return await SECP.findOne({ companyId });
};