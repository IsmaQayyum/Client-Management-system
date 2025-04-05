const ClientDTS = require("../models/ClientsDts");
const mongoose = require("mongoose");

// ✅ Auto-Create or Fetch DTS Data for a Client
const getOrCreateClientsDts = async (req, res) => {
    try {
        const { clientId } = req.params;

        // 🔍 Check if data exists
        let dtsData = await ClientDTS.findOne({ clientId });

        if (!dtsData) {
            // 🆕 If not exists, create new entry
            dtsData = await ClientDTS.create({ clientId });
        }

        res.status(200).json({ success: true, data: dtsData });

    } catch (error) {
        console.error("❌ Error fetching DTS Data:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ✅ Update DTS Data
const updateClientsDts = async (req, res) => {
    try {
        const { clientId } = req.params;
        const updateData = req.body;

        // 🔄 Find & update existing record
        const updatedDts = await ClientDTS.findOneAndUpdate(
            { clientId },
            { $set: updateData },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, data: updatedDts });

    } catch (error) {
        console.error("❌ Error updating DTS Data:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ✅ Delete DTS Data
const deleteClientsDts = async (req, res) => {
    try {
        const { clientId } = req.params;

        // 🗑️ Delete record
        const deletedDts = await ClientDTS.findOneAndDelete({ clientId });

        if (!deletedDts) {
            return res.status(404).json({ success: false, message: "No data found" });
        }

        res.status(200).json({ success: true, message: "Deleted successfully" });

    } catch (error) {
        console.error("❌ Error deleting DTS Data:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ✅ Get DTS Data by Client ID
const getDTSByClientId = async (clientId) => {
    try {
        const objectId = mongoose.Types.ObjectId.isValid(clientId) 
            ? new mongoose.Types.ObjectId(clientId) 
            : clientId;

        let clientDTS = await ClientDTS.findOne({ clientId: objectId }).lean();

        if (!clientDTS) {
            console.warn(`⚠️ No DTS found for clientId: ${clientId}`);
            return {
                dtsReg: '',
                dtsId: '',
                dtsPin: '',
                dtsPass: '',
                dtsMobile: '',
                dtsMail: '',
                dtsExpiry: '',
                dtsBgEx: ''
            };
        }

        return {
            dtsReg: clientDTS.dtsReg || '',
            dtsId: clientDTS.dtsId || '',
            dtsPin: clientDTS.dtsPin || '',
            dtsPass: clientDTS.dtsPass || '',
            dtsMobile: clientDTS.dtsMobile || '',
            dtsMail: clientDTS.dtsMail || '',
            dtsExpiry: clientDTS.dtsExpiry || '',
            dtsBgEx: clientDTS.dtsBgEx || ''
        };

    } catch (error) {
        console.error("❌ Error fetching client DTS:", error);
        throw error;
    }
};

module.exports = {
    getOrCreateClientsDts,
    updateClientsDts,
    deleteClientsDts,
    getDTSByClientId
};