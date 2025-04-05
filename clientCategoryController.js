const mongoose = require("mongoose");
const ClientCategoryData = require("../models/ClientCategoryData");


const DEFAULT_CATEGORIES = {
    audit: {}, pra: {}, fbr: {}, monthlysaletaxretrn: {}, pseb: {}, kpra: {}, bra: {}, pec: {}, wht: {}, srb: {}, iata: {}
  };
exports.getClientCategoryData = async (req, res) => {
    try {
        const { clientId, category } = req.params;
        let data = await ClientCategoryData.findOne({ clientId, category });

        if (!data) {
            console.log(`⚠️ No existing data found for ${category}. Creating default...`);
            data = new ClientCategoryData({ clientId, category });
            await data.save();
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


exports.createOrUpdateClientCategoryData = async (req, res) => {
    try {
        const { clientId, category } = req.params;
        const updates = req.body;

        // Ensure required fields exist
        const defaultData = {
            id: '',
            pin: '',
            password: '',
            reg: '',
            mobile: '',
            email: '',
            ...updates
        };

        let data = await ClientCategoryData.findOneAndUpdate(
            { clientId, category },
            defaultData,
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({ success: true, data, message: "Data saved successfully!" });
    } catch (error) {
        console.error("❌ Error saving data:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

exports.deleteClientCategoryData = async (req, res) => {
    try {
        const { clientId, category } = req.params;
        const deletedData = await ClientCategoryData.findOneAndDelete({ clientId, category });

        if (!deletedData) {
            return res.status(404).json({ success: false, message: "Data not found" });
        }

        res.status(200).json({ success: true, message: "Data deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting data:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

exports.getCategoryByClientId = async (clientId) => {
    try {
      if (!clientId) return DEFAULT_CATEGORIES;
  
      const objectId = new mongoose.Types.ObjectId(clientId);
      const categoryData = await ClientCategoryData.find({ clientId: objectId }).lean();
  
      const categories = {};
      categoryData.forEach(item => {
        if (item?.category) {
          const key = item.category.trim().toLowerCase().replace(/\s+/g, '');
          categories[key] = {
            id: item.id || "",
            pin: item.pin || "",
            password: item.password || "",
            reg: item.reg || "",
            mobile: item.mobile || "",
            email: item.email || ""
          };
        }
      });
  
      return Object.keys(categories).length ? categories : DEFAULT_CATEGORIES;
  
    } catch (error) {
      console.error("❌ Category fetch failed:", error.message);
      return DEFAULT_CATEGORIES;
    }
  };
