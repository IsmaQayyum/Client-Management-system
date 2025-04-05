const mongoose = require("mongoose");
const ClientsDetails = require("../models/ClientsDetails");

// ✅ Fetch Client Details (Used in APIs)
exports.getClientDetails = async (req, res) => {
    try {
        const { clientId } = req.params;
        let clientDetails = await ClientsDetails.findOne({ clientId });

        if (!clientDetails) {
            const defaultDetails = {
                clientId,
                clientName: "",
                address: "",
                coreg: "",
                reference: "",
                status: "CO",
                contact: "",
                repName: "",
                ntn: "",
                nic: "",
                email: "",
            };

            clientDetails = await ClientsDetails.create(defaultDetails);
        }

        res.status(200).json(clientDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Fetch Client Details by ID (Used in client-report)
exports.getClientDetailsById = async (clientId) => {
    try {
        // Convert clientId to ObjectId if valid
        const objectId = mongoose.Types.ObjectId.isValid(clientId) ? new mongoose.Types.ObjectId(clientId) : clientId;

        let clientDetails = await ClientsDetails.findOne({ clientId: objectId });

        if (!clientDetails) {
            console.warn(`⚠️ No details found for clientId: ${clientId}`);
            return null;
        }

        return clientDetails;
    } catch (error) {
        console.error("❌ Error fetching client details:", error);
        throw error;
    }
};

// ✅ Create New Client Details
exports.createClientDetails = async (req, res) => {
    try {
        const { clientId, clientName, address, coreg, reference, status, contact, repName, ntn, nic, email } = req.body;

        const newDetails = await ClientsDetails.create({
            clientId,
            clientName,
            address,
            coreg,
            reference,
            status,
            contact,
            repName,
            ntn,
            nic,
            email
        });

        res.status(201).json(newDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update Client Details
exports.updateClientDetails = async (req, res) => {
    try {
        const { clientId } = req.params;
        const updateData = req.body;

        // ✅ Ensure client exists before updating
        const existingClient = await ClientsDetails.findOne({ clientId });

        if (!existingClient) {
            return res.status(404).json({ error: "Client not found!" });
        }

        // ✅ Update only specific fields, prevent duplicate key error
        const updatedDetails = await ClientsDetails.findOneAndUpdate(
            { clientId },
            { $set: updateData }, // Use $set to update only provided fields
            { new: true } // Return updated document
        );

        res.status(200).json(updatedDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Delete Client Details
exports.deleteClientDetails = async (req, res) => {
    try {
        const { clientId } = req.params;
        const deletedDetails = await ClientsDetails.findOneAndDelete({ clientId });

        if (!deletedDetails) {
            return res.status(404).json({ error: "Client details not found" });
        }

        res.status(200).json({ message: "Client details deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getClientDetailsById = async (clientId) => {
    try {
        let clientDetails = await ClientsDetails.findOne({ clientId });

        if (!clientDetails) {
            const defaultDetails = {
                clientId,
                clientName: "",
                address: "",
                coreg: "",
                reference: "",
                status: "CO",
                contact: "",
                repName: "",
                ntn: "",
                nic: "",
                email: ""
            };
            clientDetails = await ClientsDetails.create(defaultDetails);
        }

        return clientDetails;
    } catch (error) {
        console.error("❌ Error fetching client details:", error);
        throw error;
    }
};