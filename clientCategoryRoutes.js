const express = require("express");
const router = express.Router();
const clientCategoryController = require("../controllers/clientCategoryController");

router.get("/:clientId/:category", clientCategoryController.getClientCategoryData);

router.put("/:clientId/:category", clientCategoryController.createOrUpdateClientCategoryData);


router.delete("/:clientId/:category", clientCategoryController.deleteClientCategoryData);

module.exports = router;
