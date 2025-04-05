const mongoose = require("mongoose");
const Button = require("../models/Button"); // Adjust the path as necessary

// Create or Fetch Button Data
const createOrFetchButton = async (req, res) => {
    const { companyId, group, data } = req.body;

    try {
        // Check if the button already exists
        let button = await Button.findOne({ companyId, group });

        if (!button) {
            // If it doesn't exist, create a new one
            button = new Button({ companyId, group, data });
            await button.save();
            return res.status(201).json({ message: "Button created successfully", button });
        }

        // If it exists, return the existing data
        return res.status(200).json({ message: "Button fetched successfully", button });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update Button Data
const updateButton = async (req, res) => {
    const { companyId, group, data } = req.body;

    try {
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: "Data cannot be empty" });
        }

        const button = await Button.findOneAndUpdate(
            { companyId, group },
            { data },
            { new: true, runValidators: true }
        );

        if (!button) {
            return res.status(404).json({ message: "Button not found" });
        }

        return res.status(200).json({ message: "Button updated successfully", button });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Delete Button Data
const deleteButton = async (req, res) => {
    const { companyId, group } = req.body;

    try {
        // Find the button and delete it
        const button = await Button.findOneAndDelete({ companyId, group });

        if (!button) {
            return res.status(404).json({ message: "Button not found" });
        }

        return res.status(200).json({ message: "Button deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
const getCompanyButtonsById = async (companyId) => {
    try {
        const buttons = await Button.find({ companyId });
        if (!buttons || buttons.length === 0) {
            return { buttons: [] };
        }
        return { buttons };
    } catch (error) {
        console.error("❌ Error fetching buttons:", error);
        return { buttons: [] };
    }
};






module.exports = {
    getCompanyButtonsById,
   
    createOrFetchButton,
    updateButton,
    deleteButton
};