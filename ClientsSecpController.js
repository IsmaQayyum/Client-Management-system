const ClientsSecp = require('../models/ClientsSecp'); // Adjust the path as needed
const mongoose = require("mongoose");


// ✅ Auto-Create or Fetch SECP Data for a Client
exports.getOrCreateClientsSecp = async (req, res) => {
    try {
        const { clientId } = req.params;

        // 🔍 Check if data exists
        let secpData = await ClientsSecp.findOne({ clientId });

        if (!secpData) {
            // 🆕 If not exists, create new entry
            secpData = await ClientsSecp.create({ clientId });
        }

        res.status(200).json({ success: true, data: secpData });

    } catch (error) {
        console.error("❌ Error fetching SECP Data:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ✅ Update SECP Data
exports.updateClientsSecp = async (req, res) => {
    try {
        const { clientId } = req.params;
        const updateData = req.body;

        // 🔄 Find & update existing record
        const updatedSecp = await ClientsSecp.findOneAndUpdate(
            { clientId },
            { $set: updateData },
            { new: true, upsert: true } // ✅ Create if not exists
        );

        res.status(200).json({ success: true, data: updatedSecp });

    } catch (error) {
        console.error("❌ Error updating SECP Data:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ✅ Delete SECP Data
exports.deleteClientsSecp = async (req, res) => {
    try {
        const { clientId } = req.params;

        // 🗑️ Delete record
        const deletedSecp = await ClientsSecp.findOneAndDelete({ clientId });

        if (!deletedSecp) {
            return res.status(404).json({ success: false, message: "No data found" });
        }

        res.status(200).json({ success: true, message: "Deleted successfully" });

    } catch (error) {
        console.error("❌ Error deleting SECP Data:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
exports.getSECPByClientId = async (clientId) => {
    try {
        const objectId = mongoose.Types.ObjectId.isValid(clientId) 
            ? new mongoose.Types.ObjectId(clientId) 
            : clientId;

        let secp = await ClientsSecp.findOne({ clientId: objectId }).lean(); // Add .lean()

        if (!secp) {
            console.warn(`⚠️ No SECP found for clientId: ${clientId}`);
            return {
                electOfDir: '',
                authorizedCapital: '',
                auditor: '',
                nextElection: '',
                appointmentDate: '',
                paidUpCap: '',
                form9: '',
                formA: '',
                form19: ''
            };
        }

        // Transform data to match frontend expectations
        return {
            electOfDir: secp.electOfDir || '',
            authorizedCapital: secp.authorizedCapital || '',
            auditor: secp.auditor || '',
            nextElection: secp.nextElection || '',
            appointmentDate: secp.appointmentDate || '',
            paidUpCap: secp.paidUpCap || '',
            form9: secp.form9 || '',
            formA: secp.formA || '',
            form19: secp.form19 || ''
        };

    } catch (error) {
        console.error("❌ Error fetching client SECP:", error);
        throw error;
    }
};