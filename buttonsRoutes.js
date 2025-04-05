const express = require("express");
const router = express.Router();
const {
    createOrFetchButton,
    updateButton,
    deleteButton
} = require("../controllers/buttonsController");

router.post("/createOrFetch", createOrFetchButton); // ✅ Fix route name
router.put("/update", updateButton); // ✅ Fix route name
router.delete("/delete", deleteButton); // ✅ Fix route name

module.exports = router;
