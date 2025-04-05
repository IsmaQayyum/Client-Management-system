const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Import controllers
const clientDetailsController = require("../controllers/clientsDetailsController");
const clientCategoryController = require("../controllers/clientCategoryController");
const clientBillController = require("../controllers/clientBillController");
const dtsController = require("../controllers/dtsController");
const secpController = require("../controllers/secpController");

router.get("/client-report/:clientId", async (req, res) => {
    try {
        const { clientId } = req.params;
        console.log(`🚀 Fetching Full Report for Client ID: ${clientId}`);

        if (!clientId) {
            console.error("❌ Error: Missing clientId");
            return res.status(400).json({ 
                success: false, 
                message: "Client ID is required" 
            });
        }

    
        const objectId = mongoose.Types.ObjectId.isValid(clientId) 
            ? new mongoose.Types.ObjectId(clientId)
            : clientId;

       
        const mockRes = {
            json: (data) => data,
            status: () => ({ json: (data) => data })
        };

        let clientDetails, clientCategories, clientBill, clientDTS, clientsSecp;

        // 1. Fetch Client Details
     // Change the client details fetch section to:
try {
    clientDetails = await clientDetailsController.getClientDetailsById(clientId); // Don't use objectId here
    if (!clientDetails) {
        // Create default details if needed
        const defaultDetails = {

            clientId,
            clientName: "",
            address: "",
            coreg: "",
            reference: "",
            status: "CO",
            contact: "",
            Reference: "",
            ntn: "",
            nic: "",
            email: "",
           
       
        };
        clientDetails = await ClientsDetails.create(defaultDetails);
    }
    console.log("✅ Client Details:", clientDetails);
} catch (err) {
    console.error("❌ Error fetching client details:", err.message);
    clientDetails = {
        clientName: "",
        address: "",
        coreg: "",
        reference: "",

        status: "CO",
        contact: "",
        repName: "",
        ntn: "",
        nic: "",
        email: "",
       
    };
}
        try {
            const categoriesResponse = await clientCategoryController.getCategoryByClientId(objectId);
            
            clientCategories = (categoriesResponse && !categoriesResponse.error) 
                ? categoriesResponse 
                : {
                    audit: { id: "", pin: "", password: "", reg: "", mobile: "", email: "" },
                    monthlysaletaxretrn: { id: "", pin: "", password: "", reg: "", mobile: "", email: "" },
                    fbr: { id: "", pin: "", password: "", reg: "", mobile: "", email: "" },
                    pra: { id: "", pin: "", password: "", reg: "", mobile: "", email: "" },
                    pseb: { id: "", pin: "", password: "", reg: "", mobile: "", email: "" },
                    kpra: { id: "", pin: "", password: "", reg: "", mobile: "", email: "" },
                    bra: { id: "", pin: "", password: "", reg: "", mobile: "", email: "" },
                    pec: { id: "", pin: "", password: "", reg: "", mobile: "", email: "" },
                    wht: { id: "", pin: "", password: "", reg: "", mobile: "", email: "" },
                    srb: { id: "", pin: "", password: "", reg: "", mobile: "", email: "" },
                    iata: { id: "", pin: "", password: "", reg: "", mobile: "", email: "" },
                 
                };
            console.log("✅ Client Categories:", clientCategories);
        } catch (err) {
            console.error("❌ Error fetching client categories:", err.message);
            clientCategories = {};
        }

        // 3. Fetch Client Bill
        try {
            const billResponse = await clientBillController.getBillByClientId(objectId);
            
            clientBill = billResponse || {
                amounts: {
                    audit: "0",
                    MonthlySaleTaxRetrn: "0",
                    fbr: "0",
                    pra: "0",
                    srb: "0",
                    iata: "0",
                    pseb: "0",
                    kpra: "0",
                    bra: "0",
                    pec: "0",
                    wht: "0",
                    dts: "0",
                    secp: "0"
                },
                totalAmount: 0,
                receivedAmount: "0",
                balance: 0,
                receivedDate: ""
            };
            console.log("✅ Client Bill:", clientBill);
        } catch (err) {
            console.error("❌ Error fetching client bill:", err.message);
            clientBill = {
                amounts: {
                    audit: "0",
                    // ... other default amounts
                },
                totalAmount: 0,
                receivedAmount: "0",
                balance: 0,
                receivedDate: ""
            };
        }

        // 4. Fetch DTS Data
        try {
            const dtsResponse = await dtsController.getDTSByClientId(objectId);
            clientDTS = dtsResponse || {
                dtsReg: '',
                dtsId: '',
                dtsPin: '',
                dtsPass: '',
                dtsMobile: '',
                dtsMail: '',
                dtsExpiry: '',
                dtsBgEx: ''
            };
            console.log("✅ DTS Data:", clientDTS);
        } catch (err) {
            console.error("❌ Error fetching DTS:", err.message);
            clientDTS = {
                dtsReg: '',
                // ... other default DTS fields
            };
        }

        // 5. Fetch SECP Data
        try {
            const secpResponse = await secpController.getSECPByClientId(objectId);
            clientsSecp = secpResponse || {
                electOfDir: '',
                authorizedCapital: '',
                auditor: '',
                nextElection: '',
                appointmentDate: '',
                paidUpCap: '',
                form9: '',
                formA: '',
                form19: ''
            };
            console.log("✅ SECP Data:", clientsSecp);
        } catch (err) {
            console.error("❌ Error fetching SECP:", err.message);
            clientsSecp = {
                electOfDir: '',
                // ... other default SECP fields
            };
        }

        const fullReport = {
            success: true,
            data: {
                clientDetails,
                clientDTS,
                clientsSecp,
                clientBill,
                clientCategories
            }
        };

        console.log("✅ Full Report Generated");
        res.status(200).json(fullReport);
    } catch (error) {
        console.error("❌ Error fetching full report:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error: error.message 
        });
    }
});

module.exports = router;