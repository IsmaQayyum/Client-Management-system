const express = require("express");
const router = express.Router();
const companyDetailsController = require("../controllers/companyDetailsController");


router.get("/:companyId", companyDetailsController.getCompanyDetails);


router.post("/", companyDetailsController.createOrUpdateCompanyDetails);

router.put("/:companyId", companyDetailsController.updateCompanyDetails);


router.delete("/:companyId", companyDetailsController.deleteCompanyDetails);

module.exports = router;
