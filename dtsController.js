const DTS = require("../models/Dts");

// 🔹 Generate Unique DTS ID
exports.createDTS = async (req, res) => {
    try {
        console.log("📥 Incoming DTS Request Body:", req.body);

        const { companyId, dtsBgEx } = req.body;

        if (!companyId) {
            return res.status(400).json({ error: "Company ID is required" });
        }

        // ✅ Fix: Ensure valid date format
        let formattedDate = null;
        if (dtsBgEx && !isNaN(Date.parse(dtsBgEx))) {
            formattedDate = new Date(dtsBgEx);
        } else {
            console.warn("⚠️ Invalid or missing date, setting default to today.");
            formattedDate = new Date(); // Default: today's date
        }

        const newDTS = new DTS({
            companyId,
            dtsBgEx: formattedDate // ✅ Save Correct Date
        });

        await newDTS.save();
        res.status(201).json({ message: "✅ DTS Created Successfully", data: newDTS });

    } catch (error) {
        console.error("❌ DTS Creation Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




// ✅ Create or Update DTS Record (Company-Specific)
exports.createOrUpdateDTS = async (req, res) => {
    try {
        console.log("📥 Incoming Request Body:", req.body); // ✅ Debug log
        let { companyId, dtsReg, ...updateData } = req.body;

        if (!companyId) {
            console.error("❌ Error: Company ID is missing!");
            return res.status(400).json({ message: "Company ID is required" });
        }

        if (!dtsReg || dtsReg.trim() === "") {
            console.warn("⚠️ Warning: dtsReg is missing in request, setting default.");
            dtsReg = `DTS-${Date.now()}`; // ✅ Assign default value
        }

        let dtsRecord = await DTS.findOneAndUpdate(
            { companyId },
            { $set: { dtsReg, ...updateData } },
            { new: true, upsert: true }
        );

        console.log("✅ DTS Updated/Saved:", dtsRecord);
        res.status(200).json({ success: true, data: dtsRecord });

    } catch (error) {
        console.error("❌ Error saving DTS data:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};





// ✅ Get DTS Data for a Specific Company
exports.getDTSByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        if (!companyId) {
            return res.status(400).json({ message: "Company ID is required" });
        }

        let dtsRecord = await DTS.findOne({ companyId });

        if (!dtsRecord) {
            console.log("⚠️ No DTS record found. Creating a new one...");
            dtsRecord = await DTS.create({ companyId });
        }

        res.status(200).json({ success: true, data: dtsRecord });
    } catch (error) {
        console.error("❌ Error fetching DTS records:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ✅ Delete DTS Data for a Specific Company
exports.deleteDTSByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        if (!companyId) {
            return res.status(400).json({ message: "Company ID is required" });
        }

        const deletedDTS = await DTS.findOneAndDelete({ companyId });

        if (!deletedDTS) {
            return res.status(404).json({ message: "DTS record not found" });
        }

        res.status(200).json({ success: true, message: "DTS record deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting DTS record:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
exports.getDTSByCompanyId = async (companyId) => {
    return await DTS.findOne({ companyId });
};
