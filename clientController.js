const Client = require("../models/Client");

// Create or fetch client
const createOrFetchClient = async (req, res) => {
    try {
        const { name, companyId, details } = req.body;
        
        let client = await Client.findOne({ name, companyId }); // Check if client already exists for this company
        if (!client) {
            client = new Client({ name, companyId, details }); // Create new client if not found
            await client.save();
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Error processing request", error });
    }
};


// Fetch all clients
const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find().populate("details");
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch clients", error });
    }
};

// Update client
const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const updatedClient = await Client.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: "Error updating client", error });
    }
};


// Delete client
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;

        // Find client first to get details reference
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Delete the associated details if it exists
        if (client.details) {
            await Details.findByIdAndDelete(client.details);
        }

        // Delete the client itself
        await Client.findByIdAndDelete(id);

        res.status(200).json({ message: "Client and associated details deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting client", error });
    }
};
const getClientsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        if (!companyId) {
            return res.status(400).json({ message: "Company ID is required" });
        }

        // ✅ FIX: Populate only if "details" is a reference
        const clients = await Client.find({ companyId })
            .populate({ path: "details", strictPopulate: false }) // Allow population
            .lean();

        res.status(200).json(clients);
    } catch (error) {
        console.error("❌ Error fetching clients:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



module.exports = {
    getClientsByCompany,
    createOrFetchClient,
    getAllClients,
    updateClient,
    deleteClient
};
