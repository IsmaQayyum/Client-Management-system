const express = require("express");
const router = express.Router();
const companyDetailsController = require("../controllers/companyDetailsController");
const buttonsController = require("../controllers/buttonsController");
const billController = require("../controllers/billController");
const dtsController = require("../controllers/dtsController");
const secpController = require("../controllers/secpController");

router.get("/:companyId", async (req, res) => {
    try {
        const { companyId } = req.params;
        console.log(`🚀 Fetching Full Report for Company ID: ${companyId}`);

        if (!companyId) {
            console.error("❌ Error: Missing companyId");
            return res.status(400).json({ message: "Company ID is required" });
        }

        let companyDetails = null,
            buttons = [],
            bill = null,
            dts = null,
            secp = null;

        try {
            companyDetails = await companyDetailsController.getCompanyDetailsById(companyId);
            console.log("✅ Company Details:", companyDetails);
        } catch (err) {
            console.error("❌ Error fetching company details:", err.message);
        }

        try {
            const buttonsResponse = await buttonsController.getCompanyButtonsById(companyId);
            buttons = buttonsResponse?.buttons || []; // Ensure an empty array if no data
            console.log("✅ Buttons Data:", buttons);
        } catch (err) {
            console.error("❌ Error fetching buttons:", err.message);
        }
// In the bill data fetching section:
try {
    // Get bill data - use proper Express response handling
    const billResponse = await new Promise((resolve, reject) => {
        const mockRes = {
            json: (data) => resolve(data),
            status: (code) => ({
                json: (data) => resolve(data)
            })
        };
        
        billController.getBillByCompanyId({ params: { companyId } }, mockRes)
            .catch(reject);
    });
    
    // Simplify bill data handling
    bill = billResponse?.bill || {
        amounts: {
           
            Audit: "0" ,
            MonthlySaleTaxRetrn: "0" ,
            Fbr:"0" ,
            Pra: "0" ,
            Srb: "0" ,
            Iata: "0" ,
            Pseb: "0" ,
            Kpra: "0" ,
            Bra: "0" ,
            Pec: "0" ,
            Wht: "0" ,
            Dts: "0" ,
            Secp:"0" 
        },
        totalAmount: 0,
        receivedAmount: "0",
        balance: 0,
        receivedDate: ""
    };
    
    console.log("Processed bill data:", bill);
} catch (err) {
    console.error("Error fetching bill:", err);
    bill = {
        amounts: {
            Audit: "0",
            MonthlySaleTaxRetrn: "0",
            // ... include all other default amounts
        },
        totalAmount: 0,
        receivedAmount: "0",
        balance: 0,
        receivedDate: ""
    };
}

        try {
            dts = await dtsController.getDTSByCompanyId(companyId);
            console.log("✅ DTS Data:", dts);
        } catch (err) {
            console.error("❌ Error fetching DTS:", err.message);
        }

        try {
            secp = await secpController.getSECPByCompanyId(companyId);
            console.log("✅ SECP Data:", secp);
        } catch (err) {
            console.error("❌ Error fetching SECP:", err.message);
        }

        const fullReport = { companyDetails, buttons, bill, dts, secp };
        console.log("✅ Full Report Generated:", fullReport);

        res.status(200).json(fullReport);
    } catch (error) {
        console.error("❌ Error fetching full report:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;
