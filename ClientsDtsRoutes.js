const express = require("express");
const router = express.Router();
const clientsDtsController = require("../controllers/clientDtsController");

// 📌 Routes
router.get("/:clientId", clientsDtsController.getOrCreateClientsDts); // Auto-fetch or create
router.put("/:clientId", clientsDtsController.updateClientsDts); // Update
router.delete("/:clientId", clientsDtsController.deleteClientsDts); // Delete

module.exports = router;
