const mongoose = require("mongoose");
const ClientBill = require("../models/ClientBill");
const { ObjectId } = mongoose.Types;

const createClientBill = async (req, res) => {
    try {
        console.log("📥 Create Client Bill Request Body:", req.body);

        const { clientId, amounts = {}, receivedAmount = "0", receivedDate = "" } = req.body;

        if (!clientId || !ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: "Invalid Client ID" });
        }

        const clientObjectId = new ObjectId(clientId);
        const receivedAmt = parseFloat(receivedAmount.toString().replace(/,/g, "")) || 0;
        const sanitizedAmounts = {};
        let totalAmount = 0;

        Object.entries(amounts).forEach(([key, value]) => {
            const numericValue = parseFloat(value.toString().replace(/,/g, "")) || 0;
            sanitizedAmounts[key] = numericValue;
            totalAmount += numericValue;
        });

        const balance = totalAmount - receivedAmt;

        console.log("📊 Calculated Data ->", { totalAmount, receivedAmt, balance });

        const newClientBill = new ClientBill({
            clientId: clientObjectId,
            amounts: sanitizedAmounts,
            totalAmount,
            receivedAmount: receivedAmt,
            balance,
            receivedDate: receivedDate || null,
        });

        const savedClientBill = await newClientBill.save();
        console.log("✅ Client Bill Saved Successfully:", savedClientBill);

        res.status(201).json({
            message: "Client Bill created successfully",
            bill: savedClientBill,
        });
    } catch (error) {
        console.error("❌ Create Client Bill Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const getOrCreateClientBill = async (req, res) => {
    try {
        let { clientId } = req.params;

        if (!clientId || !ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: "Invalid Client ID" });
        }

        const clientObjectId = new ObjectId(clientId);
        console.log("🔍 Searching for bill with clientId:", clientId);

        let bill = await ClientBill.findOne({ clientId: clientObjectId });

        if (!bill) {
            console.log("⚠️ No existing bill found. Creating a new one...");

            const defaultAmounts = {
                audit: 0,
        MonthlySaleTaxRetrn: 0,
        fbr: 0,
        pra: 0,
        srb: 0,
        iata: 0,
        pseb: 0,
        kpra: 0,
        bra: 0,
        pec: 0,
        wht: 0,
        dts: 0,
        secp:0
            };

            bill = new ClientBill({
                clientId: clientObjectId,
                amounts: defaultAmounts,
                totalAmount: 0,
                receivedAmount: 0,
                balance: 0,
                receivedDate: null,
            });

            await bill.save();
        }

        console.log("✅ Returning Client Bill Data:", bill);
        res.status(200).json(bill);
    } catch (error) {
        console.error("❌ Get/Create Client Bill Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const updateClientBill = async (req, res) => {
    try {
        const { billId } = req.params;
        const { amounts = {}, receivedAmount = "0", receivedDate = "" } = req.body;

        if (!billId || !ObjectId.isValid(billId)) {
            return res.status(400).json({ message: "Invalid Bill ID" });
        }

        const sanitizedAmounts = {};
        let totalAmount = 0;

        Object.entries(amounts).forEach(([key, value]) => {
            const numericValue = parseFloat(value.toString().replace(/,/g, "")) || 0;
            sanitizedAmounts[key] = numericValue;
            totalAmount += numericValue;
        });

        const receivedAmt = parseFloat(receivedAmount.toString().replace(/,/g, "")) || 0;
        const balance = totalAmount - receivedAmt;

        const updatedBill = await ClientBill.findByIdAndUpdate(
            billId,
            {
                amounts: sanitizedAmounts,
                totalAmount,
                receivedAmount: receivedAmt,
                balance,
                receivedDate: receivedDate || null,
            },
            { new: true }
        );

        if (!updatedBill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        res.status(200).json({
            message: "Client Bill updated successfully",
            bill: updatedBill,
        });
    } catch (error) {
        console.error("❌ Update Client Bill Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Delete Client Bill API
const deleteClientBill = async (req, res) => {
    try {
        const { billId } = req.params;

        if (!billId || !ObjectId.isValid(billId)) {
            return res.status(400).json({ message: "Invalid Bill ID" });
        }

        const deletedBill = await ClientBill.findByIdAndDelete(billId);

        if (!deletedBill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        res.status(200).json({ message: "Client Bill deleted successfully" });
    } catch (error) {
        console.error("❌ Delete Client Bill Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getBillByClientId = async (clientId) => {
    try {
        console.log(`🔍 Fetching Bill for Client ID: ${clientId}`);
        
        // Handle both string and ObjectId cases
        const queryId = mongoose.Types.ObjectId.isValid(clientId) 
            ? new mongoose.Types.ObjectId(clientId) 
            : clientId;
        
        let bill = await ClientBill.findOne({ clientId: queryId });

        if (!bill) {
            console.log("⚠️ No existing bill found. Creating a new one...");
            
            const defaultAmounts = {
                audit: 0,
                MonthlySaleTaxRetrn: 0,
                fbr: 0,
                pra: 0,
                srb: 0,
                iata: 0,
                pseb: 0,
                kpra: 0,
                bra: 0,
                pec: 0,
                wht: 0,
                dts: 0,
                secp: 0
            };

            bill = new ClientBill({
                clientId: queryId,
                amounts: defaultAmounts,
                totalAmount: 0,
                receivedAmount: 0,
                balance: 0,
                receivedDate: null,
            });

            await bill.save();
        }

        console.log("✅ Bill Found:", bill);
        return bill;
    } catch (error) {
        console.error("❌ Get Bill By Client ID Error:", error);
        return null;
    }
};


module.exports = {
    createClientBill,
    getOrCreateClientBill,
    updateClientBill,
    deleteClientBill,
    getBillByClientId,
};
