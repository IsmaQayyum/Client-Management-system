import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function FullClientsReport() {
    const { clientId } = useParams();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const categories = ["audit", " MonthlySaleTaxRetrn", "fbr", "pra", "srb", "iata", "pseb", "kpra", "bra", "pec", "wht"];

    const dtsFields = ["dtsReg", "dtsId", "dtsPin", "dtsPass", "dtsMobile", "dtsMail", "dtsExpiry", "dtsBgEx"];
    const secpFields = {
        text: ["electOfDir", "authorizedCapital", "auditor"],
        date: ["nextElection", "appointmentDate", "paidUpCap", "form9", "formA", "form19"]
    };


  useEffect(() => {
        console.log("🔍 Client ID received from URL:", clientId);

        const fetchFullClientReport = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log(`📡 Fetching: http://localhost:5000/api/client-report/${clientId}`);
                
                const response = await fetch(`http://localhost:5000/api/client-report/${clientId}`);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP ${response.status}`);
                }
        
                const result = await response.json();
                console.log("✅ Full API Response:", result); // Add this line
                
                if (result.success) {
                    setReportData(result.data);
                } else {
                    throw new Error(result.message || "Failed to fetch client report");
                }
            } catch (error) {
                console.error("❌ Error fetching client report:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (clientId) fetchFullClientReport();
    }, [clientId]);

    const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
    };

    if (loading) return <h3 className="text-center mt-4">⏳ Loading Client Report...</h3>;
    if (error) return <h3 className="text-center mt-4 text-danger">❌ Error: {error}</h3>;

    if (!reportData) return <h3 className="text-center mt-4">⚠️ No Data Available</h3>;

    return (
        <div className="container mt-4">
            <h2 className="text-center text-primary mb-4">
                {reportData?.clientDetails?.clientName 
                    ? `${reportData.clientDetails.clientName} - Full Report` 
                    : "Client Report"}
            </h2>

            {/* Client Details */}
            <div className="card p-4 shadow-lg">
                <h4 className="text-primary">Client Details</h4>
                <div className="row">
                    {["clientName", "address", "ntn", "email", "contact", "repName", "nic", "coreg", "reference", "status"].map((field, index) => (
                        <div className="col-md-4 mb-2" key={index}>
                            <label className="form-label fw-bold">{field.replace(/([A-Z])/g, " $1")}:</label>
                            <input type="text" className="form-control" value={reportData?.clientDetails?.[field] || "N/A"} readOnly />
                        </div>
                    ))}
                </div>
            </div>

        {/* Client Services Section */}
<h2 className="text-center text-primary">Client Services</h2>
<div className="row">
  {reportData?.clientCategories ? (
    Object.keys(reportData.clientCategories).map(categoryName => {
      const categoryData = reportData.clientCategories[categoryName];
      const hasData = categoryData && Object.values(categoryData).some(
        val => val !== "" && val !== null && val !== undefined
      );
      
      return (
        <div key={categoryName} className="col-12 mb-4 p-3 border rounded shadow-sm">
          <h5 className="text-primary">
            {categoryName.toUpperCase()} {!hasData && "- No data entered"}
          </h5>

          {hasData && (
            <>
              <div className="row">
                {["id", "pin", "password"].map((field) => (
                  <div className="col-md-4 mb-2" key={`${categoryName}-${field}`}>
                    <label className="form-label fw-bold">{field.toUpperCase()}:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={categoryData[field] || "N/A"}
                      readOnly
                    />
                  </div>
                ))}
              </div>
              <div className="row">
                {["reg", "mobile", "email"].map((field) => (
                  <div className="col-md-4 mb-2" key={`${categoryName}-${field}`}>
                    <label className="form-label fw-bold">{field.toUpperCase()}:</label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      className="form-control"
                      value={categoryData[field] || "N/A"}
                      readOnly
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
    })
  ) : (
    <div className="col-12 text-center my-4">
      <p className="text-warning">⚠️ No categories data available</p>
    </div>
  )}
</div>
            {/* DTS Details */}
            <div className="card p-4 shadow-lg mt-3">
                <h4 className="text-primary">DTS Details</h4>
                <div className="row">
                    {dtsFields.map((field, index) => (
                        <div className="col-md-4 mb-2" key={index}>
                            <label className="form-label fw-bold">{field.replace(/([A-Z])/g, " $1")}:</label>
                            <input type="text" className="form-control" value={reportData?.clientDTS?.[field] || ""} readOnly />
                        </div>
                    ))}
                </div>
            </div>

            {/* SECP Details */}
            <div className="card p-4 shadow-lg mt-3">
                <h4 className="text-primary">SECP Details</h4>
                <div className="row">
                    {secpFields.text.map((field, index) => (
                        <div className="col-md-4 mb-2" key={index}>
                            <label className="form-label fw-bold">{field.replace(/([A-Z])/g, " $1")}:</label>
                            <input type="text" className="form-control" value={reportData?.clientsSecp?.[field] || ""} readOnly />
                        </div>
                    ))}
                    {secpFields.date.map((field, index) => (
                        <div className="col-md-4 mb-2" key={index}>
                            <label className="form-label fw-bold">{field.replace(/([A-Z])/g, " $1")}:</label>
                            <input type="date" className="form-control" value={reportData?.clientsSecp?.[field] || ""} readOnly />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bill Information */}
            <div className="card p-4 shadow-lg mt-3">
                <h4 className="text-primary">Bill Information</h4>
                <div className="row">
                    {reportData?.clientBill ? (
                        <>
                            {Object.entries(reportData.clientBill.amounts || {}).map(([key, value]) => (
                                <div className="col-md-4 mb-2" key={key}>
                                    <label className="form-label fw-bold">{key.replace(/([A-Z])/g, " $1")}:</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={value || "0"} 
                                        readOnly 
                                    />
                                </div>
                            ))}
                            <div className="col-md-4 mb-2">
                                <label className="form-label fw-bold">Total Amount:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={reportData.clientBill.totalAmount || "0"} 
                                    readOnly 
                                />
                            </div>
                            <div className="col-md-4 mb-2">
                                <label className="form-label fw-bold">Received Amount:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={reportData.clientBill.receivedAmount || "0"} 
                                    readOnly 
                                />
                            </div>
                            <div className="col-md-4 mb-2">
                                <label className="form-label fw-bold">Balance:</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={reportData.clientBill.balance || "0"} 
                                    readOnly 
                                />
                            </div>
                            <div className="col-md-4 mb-2">
                                <label className="form-label fw-bold">Received Date:</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    value={reportData.clientBill.receivedDate || ""} 
                                    readOnly 
                                />
                            </div>
                        </>
                    ) : (
                        <div className="col-12">
                            <p className="text-center">No bill information available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FullClientsReport;