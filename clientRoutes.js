const express = require("express");
const router = express.Router();
const {
    createOrFetchClient,
    getAllClients,
    updateClient,
    deleteClient,
    getClientsByCompany
} = require("../controllers/clientController");

// ✅ Create or fetch a client
router.post("/", createOrFetchClient);

// ✅ Get all clients
router.get("/", getAllClients);

// ✅ Get clients by company (filtered by `companyId`)
router.get("/company/:companyId", getClientsByCompany);

// ✅ Update a client
router.put("/:id", updateClient);

// ✅ Delete a client (and its associated details)
router.delete("/:id", deleteClient);

module.exports = router;
