const express = require("express");
const router = express.Router();
const {
    createClientBill,
    getOrCreateClientBill,
    updateClientBill,
    deleteClientBill,
} = require("../controllers/clientBillController");

// ✅ Create a new Client Bill
router.post("/", createClientBill);

// ✅ Get or Create a Client Bill by clientId
router.get("/:clientId", getOrCreateClientBill);

// ✅ Update a Client Bill by billId
router.put("/:billId", updateClientBill);

// ✅ Delete a Client Bill by billId
router.delete("/:billId", deleteClientBill);

module.exports = router;
