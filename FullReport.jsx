import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function FullReport() {
    const { companyId } = useParams();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dtsFields = ["dtsReg", "dtsId", "dtsPin", "dtsPass", "dtsMobile", "dtsMail", "dtsExpiry", "dtsBgEx"];
    const secpFields = {
        text: ["electOfDir", "authorizedCapital", "auditor"],
        date: ["nextElection", "appointmentDate", "paidUpCap", "form9", "formA", "form19"]
    };
    



    console.log("📌 Fetching Full Report for companyId:", companyId);

    useEffect(() => {
        const fetchFullReport = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/full-report/${companyId}`);
                if (!response.ok) throw new Error("Failed to fetch full report");
                const data = await response.json();
                
                // TEMPORARY DEBUGGING
                console.log("Full API Response:", data);
                console.log("Bill Data Structure:", data?.bill);
                console.log("Bill Amounts Keys:", data?.bill?.amounts ? Object.keys(data.bill.amounts) : "No amounts");
                
                setReportData(data);
            } catch (error) {
                console.error("Error fetching full report:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFullReport();
    }, [companyId]);
    
    
    

    if (loading) return <h3 className="text-center mt-4">⏳ Loading Report...</h3>;
    if (error) return <h3 className="text-center mt-4 text-danger">❌ Error: {error}</h3>;

    return (
        <div className="container mt-4">
           <h2 className="text-center text-primary mb-4">
    {reportData?.companyDetails?.companyName
        ? `${reportData.companyDetails.companyName} - Final Report`
        : "Final Company Report"}
</h2>

            <div className="card p-4 shadow-lg">
           <h2 className="text-center text-primary mb-4"> Details</h2>
                <div className="row">

    <div className="col-md-6 mb-2">
        <label className="form-label fw-bold">Company Name:</label>
        <input
            type="text"
            className="form-control"
            value={reportData?.companyDetails?.companyName || ""}
            readOnly
        />
    </div>
    <div className="col-md-6 mb-2">
        <label className="form-label fw-bold">Address:</label>
        <input
            type="text"
            className="form-control"
            value={reportData?.companyDetails?.address || ""}
            readOnly
        />
    </div>

  
    <div className="col-md-3 mb-2">
        <label className="form-label fw-bold">CO Registration:</label>
        <input
            type="text"
            className="form-control"
            value={reportData?.companyDetails?.coreg || ""}
            readOnly
        />
    </div>
    <div className="col-md-3 mb-2">
        <label className="form-label fw-bold">Reference:</label>
        <input
            type="text"
            className="form-control"
            value={reportData?.companyDetails?.reference || ""}
            readOnly
        />
    </div>
    <div className="col-md-3 mb-2">
        <label className="form-label fw-bold">Status:</label>
        <input
            type="text"
            className="form-control"
            value={reportData?.companyDetails?.status || ""}
            readOnly
        />
    </div>
    <div className="col-md-3 mb-2">
        <label className="form-label fw-bold">Contact:</label>
        <input
            type="text"
            className="form-control"
            value={reportData?.companyDetails?.contact || ""}
            readOnly
        />
    </div>

 
    <div className="col-md-3 mb-2">
        <label className="form-label fw-bold">Representative Name:</label>
        <input
            type="text"
            className="form-control"
            value={reportData?.companyDetails?.repName || ""}
            readOnly
        />
    </div>
    <div className="col-md-3 mb-2">
        <label className="form-label fw-bold">NTN:</label>
        <input
            type="text"
            className="form-control"
            value={reportData?.companyDetails?.ntn || ""}
            readOnly
        />
    </div>
    <div className="col-md-3 mb-2">
        <label className="form-label fw-bold">NIC:</label>
        <input
            type="text"
            className="form-control"
            value={reportData?.companyDetails?.nic || ""}
            readOnly
        />
    </div>
    <div className="col-md-3 mb-2">
        <label className="form-label fw-bold">Email:</label>
        <input
            type="email"
            className="form-control"
            value={reportData?.companyDetails?.email || ""}
            readOnly
        />
    </div>
</div>


              

    



 



      <h2 className="text-center text-primary mb-4">Services</h2>
                <div className="row">

  {[
    "audit","MonthlySaleTaxRetrn", "fbr", "pra", "srb",
    "iata", "pseb", "kpra", "bra", "pec", "wht"
  ].map((group, index) => {
    const btn = reportData?.buttons?.find((b) => b.group === group) || { group, data: null };

    return (
      <div key={index} className="col-12 mb-4 p-3 border rounded shadow-sm">
        <h5 className="text-primary">
          {btn.group.toUpperCase()} {btn.data ? "" : "- No data entered"}
        </h5>

        {btn.data ? (
          <div className="row">
      
            <div className="col-12 d-flex flex-wrap">
              {["id", "pin", "password"].map((field) => (
                <div className="col-md-4 mb-2 px-2" key={field}>
                  <label className="form-label fw-bold">{field.toUpperCase()}:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={btn.data?.[field] || ""}
                    readOnly
                  />
                </div>
              ))}
            </div>

        
            <div className="col-12 d-flex flex-wrap">
              {["reg", "mobile", "email"].map((field) => (
                <div className="col-md-4 mb-2 px-2" key={field}>
                  <label className="form-label fw-bold">{field.toUpperCase()}:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={btn.data?.[field] || ""}
                    readOnly
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  })}
</div>
<div className="card p-4 shadow-lg">
 
 <h4 className="text-primary mt-4 mb-3"> DTS </h4>
 <div className="col-12 mb-4 p-3 border rounded shadow-sm">
     <div className="row">
         {dtsFields.map((field, index) => (
             <div className="col-md-4 mb-2" key={index}>
                 <label className="form-label fw-bold">{field.replace(/([A-Z])/g, " $1")}:</label>
                 <input
                     type={field.includes("Expiry") ? "date" : "text"}
                     className="form-control"
                     value={reportData?.dts?.[field] || ""}
                     readOnly
                 />
             </div>
         ))}
     </div>
 </div>

 <h4 className="text-primary mt-4 mb-3"> SECP </h4>
 <div className="col-12 mb-4 p-3 border rounded shadow-sm">
     <div className="row">
         {secpFields.text.map((field, index) => (
             <div className="col-md-4 mb-2" key={index}>
                 <label className="form-label fw-bold">{field.replace(/([A-Z])/g, " $1")}:</label>
                 <input
                     type="text"
                     className="form-control"
                     value={reportData?.secp?.[field] || ""}
                     readOnly
                 />
             </div>
         ))}
         {secpFields.date.map((field, index) => (
             <div className="col-md-4 mb-2" key={index}>
                 <label className="form-label fw-bold">{field.replace(/([A-Z])/g, " $1")}:</label>
                 <input
                     type="date"
                     className="form-control"
                     value={reportData?.secp?.[field] || ""}
                     readOnly
                 />
             </div>
         ))}
     </div>
 </div>
</div>


{/* Bill Information Section */}
<h3 className="text-primary mt-4 mb-3 text-center">Bill Information</h3>
<div className="col-12 mb-4 p-3 border rounded shadow-sm">
    <div className="row">
        {reportData?.bill?.amounts ? (
            Object.entries({
                // Default amounts that will be overwritten by actual data
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
                // Spread actual amounts to override defaults
                ...(reportData.bill.amounts || {})
            }).map(([key, value]) => (
                <div className="col-md-4 mb-2" key={key}>
                    <label className="form-label fw-bold">
                        {key.replace(/([A-Z])/g, " $1")}:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={value}
                        readOnly
                    />
                </div>
            ))
        ) : (
            <div className="col-12 text-center">
                <p>Bill amounts not configured</p>
            </div>
        )}
    </div>
    
    {/* Rest of your bill summary fields remain the same */}
    <div className="row mt-3">
        <div className="col-md-3 mb-2">
            <label className="form-label fw-bold">Total Amount:</label>
            <input
                type="text"
                className="form-control"
                value={reportData?.bill?.totalAmount?.toFixed(2) || "0.00"}
                readOnly
            />
        </div>
        <div className="col-md-3 mb-2">
            <label className="form-label fw-bold">Received Amount:</label>
            <input
                type="text"
                className="form-control"
                value={reportData?.bill?.receivedAmount || "0.00"}
                readOnly
            />

     </div>
        <div className="col-md-3 mb-2">
            <label className="form-label fw-bold">Balance:</label>
            <input
                type="text"
                className="form-control"
                value={reportData?.bill?.balance?.toFixed(2) || "0.00"}
                readOnly
            />
        </div>
        <div className="col-md-3 mb-2">
            <label className="form-label fw-bold">Received Date:</label>
            <input
                type="date"
                className="form-control"
                value={reportData?.bill?.receivedDate || ""}
                readOnly
            />
 </div>
 
    </div>
</div>

            </div>
        </div>
    );
}

export default FullReport;