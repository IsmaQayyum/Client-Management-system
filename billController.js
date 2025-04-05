const mongoose = require("mongoose"); 
const Bill = require("../models/bill");

const createOrUpdateBill = async (req, res) => {
    try {
        const { companyId, amounts, totalAmount, receivedAmount, balance, receivedDate } = req.body;

        if (!companyId) {
            return res.status(400).json({ success: false, message: "Company ID is required" });
        }

        let bill = await Bill.findOne({ companyId });

        if (bill) {
            // Update existing bill
            bill.amounts = amounts || bill.amounts;
            bill.totalAmount = totalAmount || bill.totalAmount;
            bill.receivedAmount = receivedAmount || bill.receivedAmount;
            bill.balance = balance || bill.balance;
            bill.receivedDate = receivedDate || bill.receivedDate;

            const updatedBill = await bill.save();
            return res.status(200).json({
                success: true,
                bill: updatedBill,
                message: "Bill updated successfully",
            });
        }

        // Create a new bill if not found
        const newBill = new Bill({
            companyId,
            amounts: amounts || {
                Audit: "0",
                MonthlySaleTaxRetrn: "0",
                Fbr: "0",
                Pra: "0",
                Srb: "0",
                Iata: "0",
                Pseb: "0",
                Kpra: "0",
                Bra: "0",
                Pec: "0",
                Wht: "0",
                Dts: "0",
                Secp: "0",
            },
            totalAmount: totalAmount || 0,
            receivedAmount: receivedAmount || "0",
            balance: balance || 0,
            receivedDate: receivedDate || new Date().toISOString(),
        });

        const savedBill = await newBill.save();
        res.status(201).json({
            success: true,
            bill: savedBill,
            message: "Bill created successfully",
        });
    } catch (error) {
        console.error("❌ Error in createOrUpdateBill:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getBillByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.params;
        const bill = await Bill.findOne({ companyId });
        
        if (!bill) {
            return res.status(200).json({ 
                success: true,
                bill: null 
            });
        }
        
        return res.status(200).json({
            success: true,
            bill
        });
    } catch (error) {
        console.error("❌ Error in getBillByCompanyId:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateBill = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid bill ID" });
        }

        let bill = await Bill.findById(id);

        // 🔹 If bill does not exist, create a new one
        if (!bill) {
            console.log("⚠️ No bill found, creating a new one...");

            bill = new Bill({
                _id: id, // Use the given ID
                companyId: updateData.companyId || null,
                amounts: updateData.amounts || {
                    Audit: "0",
                    MonthlySaleTaxRetrn: "0",
                    Fbr: "0",
                    Pra: "0",
                    Srb: "0",
                    Iata: "0",
                    Pseb: "0",
                    Kpra: "0",
                    Bra: "0",
                    Pec: "0",
                    Wht: "0",
                    Dts: "0",
                    Secp: "0",
                },
                totalAmount: updateData.totalAmount || 0,
                receivedAmount: updateData.receivedAmount || "0",
                balance: updateData.balance || 0,
                receivedDate: updateData.receivedDate || new Date().toISOString(),
            });

            await bill.save();
            return res.status(201).json({
                success: true,
                bill,
                message: "New Bill created successfully",
            });
        }

        // 🔹 If bill exists, update it
        const updatedBill = await Bill.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            bill: updatedBill,
            message: "Bill updated successfully",
        });
    } catch (error) {
        console.error("❌ Error in updateBill:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteBill = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid bill ID" });
        }

        const deletedBill = await Bill.findByIdAndDelete(id);

        if (!deletedBill) {
            return res.status(404).json({ success: false, message: "Bill not found" });
        }

        res.status(200).json({ success: true, message: "Bill deleted successfully" });
    } catch (error) {
        console.error("❌ Error in deleteBill:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllBills = async (req, res) => {
    try {
        const bills = await Bill.find().populate("companyId");

        res.status(200).json({
            success: true,
            bills,
        });
    } catch (error) {
        console.error("❌ Error in getAllBills:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createOrUpdateBill,
    getBillByCompanyId,
    updateBill,
    deleteBill,
    getAllBills,
};
