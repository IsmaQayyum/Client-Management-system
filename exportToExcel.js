const express = require("express");
const mongoose = require("mongoose");
const ExcelJS = require("exceljs");
require("dotenv").config();
const connectDB = require("./config/db");

const router = express.Router();
connectDB();

// Define all your models here...
const CompanyDetails = mongoose.models.CompanyDetails || mongoose.model("CompanyDetails", new mongoose.Schema({}, { strict: false }));
const DTS = mongoose.models.DTS || mongoose.model("DTS", new mongoose.Schema({}, { strict: false }));
const SECP = mongoose.models.SECP || mongoose.model("SECP", new mongoose.Schema({}, { strict: false }));
const Company = mongoose.models.Company || mongoose.model("Company", new mongoose.Schema({}, { strict: false }));
const ClientDTS = mongoose.models.ClientDTS || mongoose.model("ClientDTS", new mongoose.Schema({}, { strict: false }));
const ClientsSecp = mongoose.models.ClientsSecp || mongoose.model("ClientsSecp", new mongoose.Schema({}, { strict: false }));
const ClientsDetails = mongoose.models.ClientsDetails || mongoose.model("ClientsDetails", new mongoose.Schema({}, { strict: false }));
const ClientCategoryData = mongoose.models.ClientCategoryData || mongoose.model("ClientCategoryData", new mongoose.Schema({}, { strict: false }));
const ClientBill = mongoose.models.ClientBill || mongoose.model("ClientBill", new mongoose.Schema({}, { strict: false }));
const Client = mongoose.models.Client || mongoose.model("Client", new mongoose.Schema({}, { strict: false }));
const Button = mongoose.models.Button || mongoose.model("Button", new mongoose.Schema({}, { strict: false }));
const Bill = mongoose.models.Bill || mongoose.model("Bill", new mongoose.Schema({}, { strict: false }));

const groups = ["audit", "MonthlySaleTaxRetrn", "fbr", "pra", "srb", "iata", "pseb", "kpra", "bra", "pec", "wht"];
const categories = ["audit", "MonthlySaleTaxRetrn", "fbr", "pra", "srb", "iata", "pseb", "kpra", "bra", "pec", "wht"];

// Helper functions
function formatDate(date) {
    if (!date) return "N/A";
    if (typeof date === 'string') return date;
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return "N/A";
}

function createMapping(items, idField) {
    return Object.fromEntries(
        items.map(item => [item[idField]?.toString(), item])
    );
}

async function generateExcel() {
    try {
        console.log("📤 Exporting Data to Excel...");

        // Fetch all data
        const companies = await Company.find();
        const companyDetails = await CompanyDetails.find();
        const buttons = await Button.find();
        const dtsRecords = await DTS.find();
        const secpRecords = await SECP.find();
        const bills = await Bill.find();

        const clients = await Client.find();
        const clientDetails = await ClientsDetails.find();
        const clientCategoryDatas = await ClientCategoryData.find();
        const clientDtsRecords = await ClientDTS.find();
        const clientSecpRecords = await ClientsSecp.find();
        const clientBills = await ClientBill.find();

        // Create mappings
        const companyDetailsMap = createMapping(companyDetails, 'companyId');
        const buttonMap = {};
        buttons.forEach(button => {
            const companyId = button.companyId?.toString();
            if (companyId) {
                if (!buttonMap[companyId]) buttonMap[companyId] = {};
                buttonMap[companyId][button.group] = {
                    reg: button.reg || button.data?.reg,
                    id: button.id || button.data?.id,
                    pin: button.pin || button.data?.pin,
                    password: button.password || button.data?.password,
                    email: button.email || button.data?.email,
                    mobile: button.mobile || button.data?.mobile,
                    ...(typeof button.data === 'object' ? button.data : {})
                };
            }
        });

        const dtsMap = createMapping(dtsRecords, 'companyId');
        const secpMap = createMapping(secpRecords, 'companyId');
        const billMap = createMapping(bills, 'companyId');
        const clientDetailsMap = createMapping(clientDetails, 'clientId');
        const clientCategoryMap = {};
        clientCategoryDatas.forEach(c => {
            const clientId = c.clientId?.toString();
            if (clientId) {
                if (!clientCategoryMap[clientId]) clientCategoryMap[clientId] = {};
                const category = c.category?.trim();
                if (category) {
                    clientCategoryMap[clientId][category] = {
                        reg: c.reg,
                        id: c.id,
                        pin: c.pin,
                        password: c.password,
                        email: c.email,
                        mobile: c.mobile,
                        ...c.toObject()
                    };
                }
            }
        });
        const clientDtsMap = createMapping(clientDtsRecords, 'clientId');
        const clientSecpMap = createMapping(clientSecpRecords, 'clientId');
        const clientBillMap = createMapping(clientBills, 'clientId');
        
        // Group clients by company
        const clientsByCompany = clients.reduce((acc, client) => {
            const companyId = client.companyId?.toString();
            if (companyId) {
                acc[companyId] = acc[companyId] || [];
                acc[companyId].push(client);
            }
            return acc;
        }, {});

        // Create workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Companies & Clients");
        console.log("✅ Data Fetched Successfully. Preparing Excel...");

        // Define columns - Company columns first, then Client columns
        const columns = [
            // Company Information
            { header: "Company Name", key: "companyName", width: 25 },
            { header: "Company Address", key: "companyAddress", width: 30 },
            { header: "Company Email", key: "companyEmail", width: 30 },
            { header: "Company Contact", key: "companyContact", width: 30 },
            { header: "Company REP Name", key: "companyREPNAME", width: 30 },
            { header: "Company Coreg", key: "companyCoreg", width: 30 },
            { header: "Company Reference", key: "companyRefrence", width: 30 },
            { header: "Company Status", key: "companyStatus", width: 30 },
            { header: "Company NTN", key: "companyNtn", width: 30 },
            { header: "Company NIC", key: "companyNic", width: 30 },
            
            // Company DTS
            { header: "Company DTS Reg", key: "companyDtsReg", width: 20 },
            { header: "Company DTS ID", key: "companyDtsId", width: 20 },
            { header: "Company DTS PIN", key: "companyDtsPin", width: 20 },
            { header: "Company DTS Password", key: "companyDtsPass", width: 20 },
            { header: "Company DTS Email", key: "companyDtsMail", width: 30 },
            { header: "Company DTS Mobile", key: "companyDtsMobile", width: 20 },
            { header: "Company DTS Expiry", key: "companyDtsExpiry", width: 20 },
            { header: "Company DTS BG Expiry", key: "companyDtsBgEx", width: 20 },
            
            // Company SECP
            { header: "Company SECP ID", key: "companySecpId", width: 20 },
            { header: "Company Election of Director", key: "companyElectOfDir", width: 25 },
            { header: "Company Next Election Date", key: "companyNextElection", width: 20 },
            { header: "Company Authorized Capital", key: "companyAuthorizedCapital", width: 20 },
            { header: "Company Paid-Up Capital", key: "companyPaidUpCap", width: 20 },
            { header: "Company Auditor", key: "companyAuditor", width: 20 },
            { header: "Company Appointment Date", key: "companyAppointmentDate", width: 20 },
            { header: "Company Form A", key: "companyFormA", width: 20 },
            { header: "Company Form 9", key: "companyForm9", width: 20 },
            { header: "Company Form 19", key: "companyForm19", width: 20 },
            
            // Company Group Buttons
            ...groups.flatMap(group => [
                { header: `Company ${group} Reg`, key: `company${group}Reg`, width: 20 },
                { header: `Company ${group} ID`, key: `company${group}Id`, width: 20 },
                { header: `Company ${group} PIN`, key: `company${group}Pin`, width: 20 },
                { header: `Company ${group} Password`, key: `company${group}Password`, width: 20 },
                { header: `Company ${group} Email`, key: `company${group}Email`, width: 30 },
                { header: `Company ${group} Mobile`, key: `company${group}Mobile`, width: 20 }
            ]),
            
            // Company Financials
            { header: "Company Audit Amount", key: "companyAuditAmount", width: 15 },
            { header: "Company Monthly Sale Tax Amount", key: "companyMonthlySaleTaxRetrnAmount", width: 15 },
            { header: "Company FBR Amount", key: "companyFbrAmount", width: 15 },
            { header: "Company PRA Amount", key: "companyPraAmount", width: 15 },
            { header: "Company SRB Amount", key: "companySrbAmount", width: 15 },
            { header: "Company IATA Amount", key: "companyIataAmount", width: 15 },
            { header: "Company PSEB Amount", key: "companyPsebAmount", width: 15 },
            { header: "Company KPRA Amount", key: "companyKpraAmount", width: 15 },
            { header: "Company BRA Amount", key: "companyBraAmount", width: 15 },
            { header: "Company PEC Amount", key: "companyPecAmount", width: 15 },
            { header: "Company WHT Amount", key: "companyWhtAmount", width: 15 },
            { header: "Company DTS Amount", key: "companyDtsAmount", width: 15 },
            { header: "Company SECP Amount", key: "companySecpAmount", width: 15 },
            { header: "Company Total Amount", key: "companyTotalAmount", width: 20 },
            { header: "Company Received Amount", key: "companyReceivedAmount", width: 20 },
            { header: "Company Balance", key: "companyBalance", width: 15 },
            { header: "Company Received Date", key: "companyReceivedDate", width: 20 },
            
            // Client Information
            { header: "Client Name", key: "clientName", width: 25 },
            { header: "Client Address", key: "clientAddress", width: 30 },
            { header: "Client Email", key: "clientEmail", width: 30 },
            { header: "Client Contact", key: "clientContact", width: 20 },
            { header: "Client REP Name", key: "clientRepName", width: 20 },
            { header: "Client Coreg", key: "clientCoreg", width: 20 },
            { header: "Client Reference", key: "clientReference", width: 20 },
            { header: "Client Status", key: "clientStatus", width: 20 },
            { header: "Client NTN", key: "clientNtn", width: 20 },
            { header: "Client NIC", key: "clientNic", width: 20 },
            
            // Client DTS
            { header: "Client DTS Reg", key: "clientDtsReg", width: 20 },
            { header: "Client DTS ID", key: "clientDtsId", width: 20 },
            { header: "Client DTS PIN", key: "clientDtsPin", width: 20 },
            { header: "Client DTS Password", key: "clientDtsPass", width: 20 },
            { header: "Client DTS Email", key: "clientDtsMail", width: 30 },
            { header: "Client DTS Mobile", key: "clientDtsMobile", width: 20 },
            { header: "Client DTS Expiry", key: "clientDtsExpiry", width: 20 },
            { header: "Client DTS BG Expiry", key: "clientDtsBgEx", width: 20 },
            
            // Client SECP
            { header: "Client SECP ID", key: "clientSecpId", width: 20 },
            { header: "Client Election of Director", key: "clientElectOfDir", width: 25 },
            { header: "Client Next Election Date", key: "clientNextElection", width: 20 },
            { header: "Client Authorized Capital", key: "clientAuthorizedCapital", width: 20 },
            { header: "Client Paid-Up Capital", key: "clientPaidUpCap", width: 20 },
            { header: "Client Auditor", key: "clientAuditor", width: 20 },
            { header: "Client Appointment Date", key: "clientAppointmentDate", width: 20 },
            { header: "Client Form A", key: "clientFormA", width: 20 },
            { header: "Client Form 9", key: "clientForm9", width: 20 },
            { header: "Client Form 19", key: "clientForm19", width: 20 },
            
            // Client Categories
            ...categories.flatMap(category => [
                { header: `Client ${category} Reg`, key: `client${category}Reg`, width: 20 },
                { header: `Client ${category} ID`, key: `client${category}Id`, width: 20 },
                { header: `Client ${category} PIN`, key: `client${category}Pin`, width: 20 },
                { header: `Client ${category} Password`, key: `client${category}Password`, width: 20 },
                { header: `Client ${category} Email`, key: `client${category}Email`, width: 30 },
                { header: `Client ${category} Mobile`, key: `client${category}Mobile`, width: 20 }
            ]),
            
            // Client Financials
            { header: "Client Audit Amount", key: "clientAuditAmount", width: 15 },
            { header: "Client Monthly Sale Tax Amount", key: "clientMonthlySaleTaxRetrnAmount", width: 15 },
            { header: "Client FBR Amount", key: "clientFbrAmount", width: 15 },
            { header: "Client PRA Amount", key: "clientPraAmount", width: 15 },
            { header: "Client SRB Amount", key: "clientSrbAmount", width: 15 },
            { header: "Client IATA Amount", key: "clientIataAmount", width: 15 },
            { header: "Client PSEB Amount", key: "clientPsebAmount", width: 15 },
            { header: "Client KPRA Amount", key: "clientKpraAmount", width: 15 },
            { header: "Client BRA Amount", key: "clientBraAmount", width: 15 },
            { header: "Client PEC Amount", key: "clientPecAmount", width: 15 },
            { header: "Client WHT Amount", key: "clientWhtAmount", width: 15 },
            { header: "Client DTS Amount", key: "clientDtsAmount", width: 15 },
            { header: "Client SECP Amount", key: "clientSecpAmount", width: 15 },
            { header: "Client Total Amount", key: "clientTotalAmount", width: 20 },
            { header: "Client Received Amount", key: "clientReceivedAmount", width: 20 },
            { header: "Client Balance", key: "clientBalance", width: 15 },
            { header: "Client Received Date", key: "clientReceivedDate", width: 20 }
        ];

        sheet.columns = columns;

        // Process companies and their clients
        companies.forEach(company => {
            const companyId = company._id.toString();
            const companyDetail = companyDetailsMap[companyId] || {};
            const dtsData = dtsMap[companyId] || {};
            const secpData = secpMap[companyId] || {};
            const billData = billMap[companyId] || {};
            const billAmounts = billData.amounts || {};
            const companyButtons = buttonMap[companyId] || {};

            // Create company row
            const companyRow = {
                // Company Information
                companyName: company.companyName || "N/A",
                companyAddress: companyDetail.address || "N/A",
                companyEmail: companyDetail.email || "N/A",
                companyContact: companyDetail.contact || "N/A",
                companyREPNAME: companyDetail.repName || "N/A",
                companyCoreg: companyDetail.coreg || "N/A",
                companyRefrence: companyDetail.reference || "N/A",
                companyStatus: companyDetail.status || "N/A",
                companyNtn: companyDetail.ntn || "N/A",
                companyNic: companyDetail.nic || "N/A",
                
                // Company DTS
                companyDtsReg: dtsData.reg || dtsData.dtsReg || "N/A",
                companyDtsId: dtsData.id || dtsData.dtsId || "N/A",
                companyDtsPin: dtsData.pin || dtsData.dtsPin || "N/A",
                companyDtsPass: dtsData.password || dtsData.dtsPass || "N/A",
                companyDtsMail: dtsData.email || dtsData.dtsMail || "N/A",
                companyDtsMobile: dtsData.mobile || dtsData.dtsMobile || "N/A",
                companyDtsExpiry: formatDate(dtsData.expiry || dtsData.dtsExpiry),
                companyDtsBgEx: formatDate(dtsData.bgExpiry || dtsData.dtsBgEx),
                
                // Company SECP
                companySecpId: secpData.secpId || secpData.id || "N/A",
                companyElectOfDir: secpData.electOfDir || secpData.electionOfDirector || "N/A",
                companyNextElection: formatDate(secpData.nextElection),
                companyAuthorizedCapital: secpData.authorizedCapital || "N/A",
                companyPaidUpCap: secpData.paidUpCap || secpData.paidUpCapital || "N/A",
                companyAuditor: secpData.auditor || "N/A",
                companyAppointmentDate: formatDate(secpData.appointmentDate),
                companyFormA: secpData.formA || "N/A",
                companyForm9: secpData.form9 || "N/A",
                companyForm19: secpData.form19 || "N/A",
                
                // Company Group Buttons
                ...groups.flatMap(group => {
                    const buttonData = companyButtons[group] || {};
                    return {
                        [`company${group}Reg`]: buttonData.reg || "N/A",
                        [`company${group}Id`]: buttonData.id || "N/A",
                        [`company${group}Pin`]: buttonData.pin || "N/A",
                        [`company${group}Password`]: buttonData.password || "N/A",
                        [`company${group}Email`]: buttonData.email || "N/A",
                        [`company${group}Mobile`]: buttonData.mobile || "N/A"
                    };
                }),
                
                // Company Financials
                companyAuditAmount: billAmounts.audit || billAmounts.Audit || "N/A",
                companyMonthlySaleTaxRetrnAmount: billAmounts.MonthlySaleTaxRetrn || "N/A",
                companyFbrAmount: billAmounts.fbr || billAmounts.Fbr || "N/A",
                companyPraAmount: billAmounts.pra || billAmounts.Pra || "N/A",
                companySrbAmount: billAmounts.srb || billAmounts.Srb || "N/A",
                companyIataAmount: billAmounts.iata || billAmounts.Iata || "N/A",
                companyPsebAmount: billAmounts.pseb || billAmounts.Pseb || "N/A",
                companyKpraAmount: billAmounts.kpra || billAmounts.Kpra || "N/A",
                companyBraAmount: billAmounts.bra || billAmounts.Bra || "N/A",
                companyPecAmount: billAmounts.pec || billAmounts.Pec || "N/A",
                companyWhtAmount: billAmounts.wht || billAmounts.Wht || "N/A",
                companyDtsAmount: billAmounts.dts || billAmounts.Dts || "N/A",
                companySecpAmount: billAmounts.secp || billAmounts.Secp || "N/A",
                companyTotalAmount: billData.totalAmount || "N/A",
                companyReceivedAmount: billData.receivedAmount || "N/A",
                companyBalance: billData.balance || "N/A",
                companyReceivedDate: formatDate(billData.receivedDate)
            };

            // Add company row to sheet
            sheet.addRow(companyRow);

            // Process clients for this company
            const companyClients = clientsByCompany[companyId] || [];
            companyClients.forEach(client => {
                const clientId = client._id.toString();
                const clientDetail = clientDetailsMap[clientId] || {};
                const clientDtsData = clientDtsMap[clientId] || {};
                const clientSecpData = clientSecpMap[clientId] || {};
                const clientBillData = clientBillMap[clientId] || {};
                const clientBillAmounts = clientBillData.amounts || {};
                const clientCategories = clientCategoryMap[clientId] || {};

                // Create client row (with empty company columns)
                const clientRow = {
                    // Client Information
                    clientName: client.name || "N/A",
                    clientAddress: clientDetail.address || "N/A",
                    clientEmail: clientDetail.email || "N/A",
                    clientContact: clientDetail.contact || "N/A",
                    clientRepName: clientDetail.repName || "N/A",
                    clientCoreg: clientDetail.coreg || "N/A",
                    clientReference: clientDetail.reference || "N/A",
                    clientStatus: clientDetail.status || "N/A",
                    clientNtn: clientDetail.ntn || "N/A",
                    clientNic: clientDetail.nic || "N/A",
                    
                    // Client DTS
                    clientDtsReg: clientDtsData.reg || clientDtsData.dtsReg || "N/A",
                    clientDtsId: clientDtsData.id || clientDtsData.dtsId || "N/A",
                    clientDtsPin: clientDtsData.pin || clientDtsData.dtsPin || "N/A",
                    clientDtsPass: clientDtsData.password || clientDtsData.dtsPass || "N/A",
                    clientDtsMail: clientDtsData.email || clientDtsData.dtsMail || "N/A",
                    clientDtsMobile: clientDtsData.mobile || clientDtsData.dtsMobile || "N/A",
                    clientDtsExpiry: formatDate(clientDtsData.expiry || clientDtsData.dtsExpiry),
                    clientDtsBgEx: formatDate(clientDtsData.bgExpiry || clientDtsData.dtsBgEx),
                    
                    // Client SECP
                    clientSecpId: clientSecpData.secpId || clientSecpData.id || "N/A",
                    clientElectOfDir: clientSecpData.electOfDir || clientSecpData.electionOfDirector || "N/A",
                    clientNextElection: formatDate(clientSecpData.nextElection),
                    clientAuthorizedCapital: clientSecpData.authorizedCapital || "N/A",
                    clientPaidUpCap: clientSecpData.paidUpCap || clientSecpData.paidUpCapital || "N/A",
                    clientAuditor: clientSecpData.auditor || "N/A",
                    clientAppointmentDate: formatDate(clientSecpData.appointmentDate),
                    clientFormA: clientSecpData.formA || "N/A",
                    clientForm9: clientSecpData.form9 || "N/A",
                    clientForm19: clientSecpData.form19 || "N/A",
                    
                    // Client Categories
                    ...categories.flatMap(category => {
                        const categoryData = clientCategories[category] || {};
                        return {
                            [`client${category}Reg`]: categoryData.reg || "N/A",
                            [`client${category}Id`]: categoryData.id || "N/A",
                            [`client${category}Pin`]: categoryData.pin || "N/A",
                            [`client${category}Password`]: categoryData.password || "N/A",
                            [`client${category}Email`]: categoryData.email || "N/A",
                            [`client${category}Mobile`]: categoryData.mobile || "N/A"
                        };
                    }),
                    
                    // Client Financials
                    clientAuditAmount: clientBillAmounts.audit || "N/A",
                    clientMonthlySaleTaxRetrnAmount: clientBillAmounts.MonthlySaleTaxRetrn || "N/A",
                    clientFbrAmount: clientBillAmounts.fbr || "N/A",
                    clientPraAmount: clientBillAmounts.pra || "N/A",
                    clientSrbAmount: clientBillAmounts.srb || "N/A",
                    clientIataAmount: clientBillAmounts.iata || "N/A",
                    clientPsebAmount: clientBillAmounts.pseb || "N/A",
                    clientKpraAmount: clientBillAmounts.kpra || "N/A",
                    clientBraAmount: clientBillAmounts.bra || "N/A",
                    clientPecAmount: clientBillAmounts.pec || "N/A",
                    clientWhtAmount: clientBillAmounts.wht || "N/A",
                    clientDtsAmount: clientBillAmounts.dts || "N/A",
                    clientSecpAmount: clientBillAmounts.secp || "N/A",
                    clientTotalAmount: clientBillData.totalAmount || "N/A",
                    clientReceivedAmount: clientBillData.receivedAmount || "N/A",
                    clientBalance: clientBillData.balance || "N/A",
                    clientReceivedDate: formatDate(clientBillData.receivedDate)
                };

                // Add client row to sheet
                sheet.addRow(clientRow);
            });
        });

        console.log("✅ Excel file ready.");
        return workbook;
    } catch (error) {
        console.error("❌ Error exporting data:", error);
        throw error;
    }
}

// Define the route handler
router.get("/export-excel", async (req, res) => {
    try {
        const workbook = await generateExcel();
        
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=Company_Clients_Data.xlsx");

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("❌ Error exporting data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = {
    router,
    generateExcel
};