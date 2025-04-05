const express = require("express");
const router = express.Router();
const companyDetailsController = require("../controllers/companyDetailsController");

// Company Details Routes
router.get("/:companyId", companyDetailsController.getCompanyDetails);
router.post("/", companyDetailsController.createCompanyDetails);
router.put("/:companyId", companyDetailsController.updateCompanyDetails);
router.delete("/:companyId", companyDetailsController.deleteCompanyDetails);

module.exports = router;
