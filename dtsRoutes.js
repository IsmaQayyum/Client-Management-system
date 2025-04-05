const express = require("express");
const router = express.Router();
const dtsController = require("../controllers/dtsController");

router.get("/:companyId", dtsController.getDTSByCompany);


router.post("/", dtsController.createOrUpdateDTS);


router.delete("/:companyId", dtsController.deleteDTSByCompany);

module.exports = router;
