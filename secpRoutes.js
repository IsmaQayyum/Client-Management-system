const express = require("express");
const router = express.Router();
const secpController = require("../controllers/secpController");

// ✅ Get SECP data for a specific company
router.get("/:companyId", secpController.getSECPByCompany);

// ✅ Create or Update SECP data for a specific company
router.post("/", secpController.createOrUpdateSECP);

// ✅ Delete SECP data for a company
router.delete("/:companyId", secpController.deleteSECPByCompany);

module.exports = router;
