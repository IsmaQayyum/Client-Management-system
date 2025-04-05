const express = require("express");
const router = express.Router();
const clientsSecpController = require("../controllers/ClientsSecpController");

// 📌 Routes
router.get("/:clientId", clientsSecpController.getOrCreateClientsSecp); // Auto-fetch or create
router.put("/:clientId", clientsSecpController.updateClientsSecp); // Update
router.delete("/:clientId", clientsSecpController.deleteClientsSecp); // Delete

module.exports = router;
