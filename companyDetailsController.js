const mongoose = require("mongoose");
const CompanyDetails = require("../models/CompanyDetails");


exports.getCompanyDetails = async (req, res) => {
    try {
        console.log(`q Fetching Company Details for ID: ${req.params.companyId}`);
        
        if (!req.params.companyId) {
            console.error("❌ companyId is missing in request params.");
            return res.status(400).json({ error: "Company ID is required" });
        }

        let companyDetails = await CompanyDetails.findOne({ companyId: req.params.companyId });

        if (!companyDetails) {
            console.log(`🔍 Company not found, attempting to create: ${req.params.companyId}`);

            const defaultDetails = {
                companyId: req.params.companyId,
                companyName: "Unknown Company",
                address: "",
                repName: "",
                email: "",
                details: "",
            };

            companyDetails = await CompanyDetails.create(defaultDetails);
            console.log("✅ Auto-created company details:", companyDetails);
        }

        res.status(200).json(companyDetails);
    } catch (error) {
        console.error(" Error in getCompanyDetails:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.createOrUpdateCompanyDetails = async (req, res) => {
    try {
        const { companyId, companyName, email, ...otherFields } = req.body;

        if (!companyId || !companyName) {
            console.error(" Missing Required Fields:", { companyId, companyName });
            return res.status(400).json({ error: "Company ID and Name are required!" });
        }

        console.log(`📡 Checking if company exists: ${companyId}`);

    
        if (email) {
            const existingCompanyWithEmail = await CompanyDetails.findOne({ email, companyId: { $ne: companyId } });
            if (existingCompanyWithEmail) {
                return res.status(400).json({ error: "This email is already registered. Use a different email." });
            }
        }

      
        const updatedDetails = await CompanyDetails.findOneAndUpdate(
            { companyId },
            { $set: { companyId, companyName, email, ...otherFields } },
            { new: true, upsert: true, runValidators: true }
        );

        console.log("✅ Company Details Saved/Updated:", updatedDetails);
        res.status(200).json(updatedDetails);

    } catch (error) {
        console.error("❌ Error saving company details:", error.message);
        res.status(500).json({ error: error.message });
    }
};


exports.updateCompanyDetails = async (req, res) => {
    try {
        const { companyId } = req.params;
        const updateData = req.body;

        console.log(`📡 Updating Company Details for companyId: ${companyId}`);
        console.log(`📥 Update Data:`, updateData);

        if (!companyId) {
            return res.status(400).json({ error: "Company ID is required" });
        }

        const updatedDetails = await CompanyDetails.findOneAndUpdate(
            { companyId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedDetails) {
            console.log("⚠️ Company not found!");
            return res.status(404).json({ error: "Company not found" });
        }

        console.log("✅ Updated Company Details:", updatedDetails);

        // 🔄 Excel regenerate karo
        await generateExcel();

        res.status(200).json({ success: true, data: updatedDetails });

    } catch (error) {
        console.error("❌ Error updating company details:", error.message);
        res.status(500).json({ error: error.message });
    }
};
;


exports.deleteCompanyDetails = async (req, res) => {
    try {
        const { companyId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ error: "Invalid company ID format" });
        }

        const deletedDetails = await CompanyDetails.findOneAndDelete({ companyId: companyId.toString() });

        if (!deletedDetails) {
            return res.status(404).json({ error: "Company details not found" });
        }

        res.status(200).json({ message: "Company details deleted successfully" });
    } catch (error) {
        console.error(" Error deleting company details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.getCompanyDetailsById = async (companyId) => {
    return await CompanyDetails.findOne({ companyId });
};


exports.createCompanyDetails = async (req, res) => {
    try {
        const { companyId, companyName, repName, address, email, details } = req.body;

       
        if (email) {
            const existingCompanyWithEmail = await CompanyDetails.findOne({ email });
            if (existingCompanyWithEmail) {
                return res.status(400).json({ error: "This email is already registered. Use a different email." });
            }
        }

        const companyDetails = new CompanyDetails({ companyId, companyName, repName, address, email, details });
        await companyDetails.save();
        res.status(201).json(companyDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
