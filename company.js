const mongoose = require('mongoose');
const express = require('express');
const Company = require('../models/Company')
const router = express.Router();
// Add a new company
router.post('/add', async (req, res) => {
    try {
        console.log("Received data:", req.body);  
        let { companyName, repName, details } = req.body;

        if (!companyName || !repName) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // ✅ Agar details empty string hai to null set karo
        if (!details || details === "") {
            details = null;
        }

        const newCompany = new Company({ companyName, repName, details });

        console.log("Saving to DB:", newCompany);
        await newCompany.save();

        res.status(201).json({ message: 'Company added successfully', company: newCompany });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: error.message });
    }
});
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid company ID' });
        }

        const deletedCompany = await Company.findByIdAndDelete(id);
        if (!deletedCompany) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.status(200).json({ message: 'Company deleted successfully', id });
    } catch (error) {
        res.status(500).json({ error: 'Server error while deleting company' });
    }
});




router.get('/all', async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching companies' });
    }
});

module.exports = router;
