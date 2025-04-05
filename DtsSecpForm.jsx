import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DtsSecpForm({ companyId: propCompanyId, onServiceStatusChange }) {
  const { id: urlCompanyId } = useParams();
  const companyId = propCompanyId || urlCompanyId;
  const [serviceStatuses, setServiceStatuses] = useState({
    DTS: "yes",  // Default values, update as needed
    SECP: "yes"
  });
  

  const [activeForm, setActiveForm] = useState("");
  const [formValues, setFormValues] = useState({ dts: {} });
  const [secpData, setSecpData] = useState({});

  const dtsFields = {
    text: ["dtsReg", "dtsId", "dtsPin", "dtsPass", "dtsMobile", "dtsMail"],
    date: ["dtsExpiry", "dtsBgEx"]
};
  const secpFields = {
    text: [ "authorizedCapital","paidUpCap", "auditor"],
    date: ["nextElection","electOfDir", "appointmentDate",  "form9", "formA", "form19"]
  };

  useEffect(() => {
    if (!companyId) return;
    console.log("🔍 Fetching data for company:", companyId);

    const savedDts = localStorage.getItem(`dtsData-${companyId}`);
    const savedSecp = localStorage.getItem(`secpData-${companyId}`);
    if (savedDts) setFormValues({ dts: JSON.parse(savedDts) });
    if (savedSecp) setSecpData(JSON.parse(savedSecp));

    axios.get(`http://localhost:5000/api/dts/${companyId}`)
      .then(res => {
        console.log("✅ DTS Data Fetched:", res.data);
        setFormValues({ dts: res.data.data || {} });
      })
      .catch(err => {
        console.error("❌ Error fetching DTS:", err.response?.data || err.message);
      });

    axios.get(`http://localhost:5000/api/secp/${companyId}`)
      .then(res => {
        setSecpData(res.data.data || {});
        localStorage.setItem(`secpData-${companyId}`, JSON.stringify(res.data.data));
      })
      .catch(err => console.error("❌ Error fetching SECP:", err));
  }, [companyId]);

  const handleDTSInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => {
      const updatedDts = { ...prev.dts, [name]: value };
      localStorage.setItem(`dtsData-${companyId}`, JSON.stringify(updatedDts));
      return { dts: updatedDts };
    });
  };

  const handleSECPInput = (e) => {
    const { name, value } = e.target;
    setSecpData(prev => {
      const updatedSecp = { ...prev, [name]: value };
      localStorage.setItem(`secpData-${companyId}`, JSON.stringify(updatedSecp));
      return updatedSecp;
    });
  };

  const saveDTSChanges = async () => {
    try {
      if (!companyId) {
        console.error("❌ Error: companyId is undefined!");
        alert("Company ID is required!");
        return;
      }

      if (!formValues.dts || Object.keys(formValues.dts).length === 0) {
        console.error("❌ Error: No DTS data provided!");
        alert("DTS data is required.");
        return;
      }

      console.log("📡 Saving DTS for company:", companyId, formValues.dts);

      const response = await axios.post(`http://localhost:5000/api/dts`, {
        ...formValues.dts,
        companyId
      });

      alert("✅ DTS Data Saved Successfully!");
      setFormValues(prev => ({ ...prev, dts: response.data.data }));
      localStorage.setItem(`dtsData-${companyId}`, JSON.stringify(response.data.data));

    } catch (error) {
      console.error("❌ Error saving DTS:", error.response?.data || error.message);
      alert("❌ Failed to save DTS data.");
    }
  };

  const saveSECPChanges = async () => {
    try {
      if (!companyId) {
        console.error("❌ Error: companyId is undefined!");
        alert("❌ Company ID is missing!");
        return;
      }

      const payload = { ...secpData, companyId };
      console.log("📤 Sending SECP Data:", payload);

      const response = await axios.post(`http://localhost:5000/api/secp`, payload);
      alert("✅ SECP Data Saved Successfully!");
      setSecpData(response.data.data);
      localStorage.setItem(`secpData-${companyId}`, JSON.stringify(response.data.data));

    } catch (error) {
      console.error("❌ Error saving SECP:", error.response?.data || error.message);
      alert("❌ Failed to save SECP data");
    }
  };

  const handleServiceStatusChange = (formType, value) => {
    setServiceStatuses((prev) => ({ ...prev, [formType]: value }));
    
    
    if (typeof onServiceStatusChange === "function") {
      onServiceStatusChange((prev) => ({ ...prev, [formType.toLowerCase()]: value }));
    }
  };

  return (
    <div className="container mt-5">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <div className="d-flex justify-content-center w-100">
            <button
              className="btn btn-primary mx-2"
              onClick={() => setActiveForm("DTS")}
              disabled={serviceStatuses.DTS === "no"}
            >
              DTS
            </button>
            <button
              className="btn btn-secondary mx-2"
              onClick={() => setActiveForm("SECP")}
              disabled={serviceStatuses.SECP === "no"}
            >
              SECP
            </button>
          </div>
        </div>
      </div>
      
      <div className="row text-center mb-3">
        <div className="col-6">
          <label className="me-2">DTS:</label>
          <input type="radio" name="DTS" value="yes" checked={serviceStatuses.DTS === "yes"} onChange={() => handleServiceStatusChange("DTS", "yes")} /> ✅
          <input type="radio" name="DTS" value="no" checked={serviceStatuses.DTS === "no"} onChange={() => handleServiceStatusChange("DTS", "no")} /> ❌
        </div>
        <div className="col-6">
          <label className="me-2">SECP:</label>
          <input type="radio" name="SECP" value="yes" checked={serviceStatuses.SECP === "yes"} onChange={() => handleServiceStatusChange("SECP", "yes")} /> ✅
          <input type="radio" name="SECP" value="no" checked={serviceStatuses.SECP === "no"} onChange={() => handleServiceStatusChange("SECP", "no")} /> ❌
        </div>
      </div>
      {activeForm === "DTS" && (
        <div className="card p-4">
          <h3>DTS Details</h3>
          <div className="row mb-3">
           {/* Looping through text fields */}
{dtsFields.text.map((field) => (
  <div className="col-md-4" key={field}>
    <label className="form-label">{field.replace(/([A-Z])/g, " $1")}:</label>
    <input
      type="text"
      name={field}
      value={formValues.dts[field] || ""}
      onChange={handleDTSInputChange}
      className="form-control"
    />
  </div>
))}

{/* Looping through date fields */}
{dtsFields.date.map((field) => (
  <div className="col-md-4" key={field}>
    <label className="form-label">{field.replace(/([A-Z])/g, " $1")}:</label>
    <input
      type="date"
      name={field}
      value={formValues.dts[field] || ""}
      onChange={handleDTSInputChange}
      className="form-control"
    />
  </div>
))}

          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-danger" onClick={() => setActiveForm("")}>Exit</button>
            <button className="btn btn-success" onClick={saveDTSChanges}>Save</button>
          </div>
        </div>
      )}

      {activeForm === "SECP" && (
        <div className="card p-4">
          <h3>SECP Details</h3>
          <div className="row mb-3">
            {secpFields.text.map((field) => (
              <div className="col-md-4" key={field}>
                <label className="form-label">{field.replace(/([A-Z])/g, " $1")}:</label>
                <input
                  type="text"
                  name={field}
                  value={secpData[field] || ""}
                  onChange={handleSECPInput}
                  className="form-control"
                />
              </div>
            ))}
            {secpFields.date.map((field) => (
              <div className="col-md-4" key={field}>
                <label className="form-label">{field.replace(/([A-Z])/g, " $1")}:</label>
                <input
                  type="date"
                  name={field}
                  value={secpData[field] || ""}
                  onChange={handleSECPInput}
                  className="form-control"
                />
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-between">
            <button className="btn btn-danger" onClick={() => setActiveForm("")}>Exit</button>
            <button className="btn btn-success" onClick={saveSECPChanges}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DtsSecpForm;