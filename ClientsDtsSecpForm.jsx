import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

function ClientsDtsSecpForm( { onServiceChange }) {
    const { id: clientId } = useParams();
    const [activeForm, setActiveForm] = useState("DTS");
    const [serviceCheckboxes, setServiceCheckboxes] = useState({
        dts: "yes",
        secp: "yes",
    });

    // ✅ Ensure clientId exists before making API calls
    if (!clientId) {
        console.error("❌ Error: clientId is undefined!");
        return <div>Error: clientId is missing!</div>;
    }

    
    const [dtsEnabled, setDtsEnabled] = useState(true);
    const [secpEnabled, setSecpEnabled] = useState(true);
    const [loading, setLoading] = useState(true);

    // ✅ Define Missing States
    const [dtsData, setDtsData] = useState({});
    const [secpData, setSecpData] = useState({});

    // ✅ DTS & SECP Fields Definition
    const dtsFields = {
        text: ["dtsReg", "dtsId", "dtsPin", "dtsPass", "dtsMobile", "dtsMail"],
        date: ["dtsExpiry", "dtsBgEx"]
    };

    const secpFields = {
        text: ["authorizedCapital", "auditor","PaidupCap"],
        date: ["electOfDir", "nextElection", "appointmentDate", "form9", "formA", "form19"]
    };

    // ✅ Fetch DTS & SECP Data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [dtsRes, secpRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/clientsDts/${clientId}`),
                    axios.get(`${API_BASE_URL}/clientsSecp/${clientId}`)
                ]);

                if (dtsRes.data.success) {
                    setDtsData(dtsRes.data.data || {});
                    localStorage.setItem(`dtsData-${clientId}`, JSON.stringify(dtsRes.data.data));
                }

                if (secpRes.data.success) {
                    setSecpData(secpRes.data.data || {});
                    localStorage.setItem(`secpData-${clientId}`, JSON.stringify(secpRes.data.data));
                }
            } catch (error) {
                console.error("❌ Error fetching data:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [clientId]);

    // ✅ Handle Input Changes & Update Local Storage
    const handleChange = (e, setter, key) => {
        const { name, value } = e.target;
        setter(prev => {
            const updatedData = { ...prev, [name]: value };
            localStorage.setItem(`${key}-${clientId}`, JSON.stringify(updatedData));
            return updatedData;
        });
    };

    // ✅ Handle Save API Calls
    const handleSave = async (data, type, setter, key) => {
        try {
            const url = `${API_BASE_URL}/${type}/${clientId}`;
            console.log("📡 Saving to:", url, "Data:", data);

            const res = await axios.put(url, data);

            if (res.data.success) {
                alert(`✅ ${type.toUpperCase()} Data saved successfully!`);
                setter(res.data.data);
                localStorage.setItem(`${key}-${clientId}`, JSON.stringify(res.data.data));
            } else {
                alert(`❌ ${type.toUpperCase()} Data not saved: ${res.data.message}`);
            }
        } catch (error) {
            console.error(`❌ Error saving ${type} data:`, error.response?.data || error.message);
            alert(`❌ Error saving ${type} data. Check console for details.`);
        }
    };
    const handleCheckboxChange = (service, value) => {
        setServiceCheckboxes((prev) => {
            const updatedCheckboxes = { ...prev, [service]: value };
    
            if (onServiceChange) {
                onServiceChange(updatedCheckboxes); // ✅ Only call if the prop exists
            }
    
            return updatedCheckboxes;
        });
    };
    

    if (loading) return <div className="text-center">Loading data...</div>;

    return (
        <div className="container mt-5">
            <div className="row text-center mb-4">
            <div className="col-12">
    <div className="d-flex align-items-left">
        {/* DTS Section */}
        <div className="d-flex flex-column align-items-start me-4">
            <div className="mb-2">
                
                <div className="d-flex align-items-center">
                    <input
                        type="radio"
                        name="dtsToggle"
                        value="yes"
                        checked={serviceCheckboxes.dts === "yes"}
                        onChange={() => handleCheckboxChange("dts", "yes")}
                      
                        className="form-check-input me-1"
                    />
                    <label className="me-2">✅ Yes</label>

                    <input
                        type="radio"
                        name="dtsToggle"
                        value="no"
                        checked={serviceCheckboxes.dts === "no"}
                        onChange={() => handleCheckboxChange("dts", "no")}
                        className="form-check-input me-1"
                    />
                    <label>❌ No</label>
                </div>
            </div>

            <button
                type="button"
                className={`btn ${activeForm === "DTS" ? "btn-primary" : "btn-outline-primary"} w-100 text-start`}
                onClick={() => setActiveForm("DTS")}
                disabled={!dtsEnabled}
            >
                DTS
            </button>
        </div>

        {/* SECP Section */}
        <div className="d-flex flex-column align-items-start">
            <div className="mb-2">
             
                <div className="d-flex align-items-center">
                    <input
                        type="radio"
                        name="secpToggle"
                        value="yes"
                        checked={serviceCheckboxes.secp === "yes"}
                        onChange={() => handleCheckboxChange("secp", "yes")}
                        className="form-check-input me-1"
                    />
                    <label className="me-2">✅ Yes</label>

                    <input
                        type="radio"
                        name="secpToggle"
                        value="no"
                        checked={serviceCheckboxes.secp === "no"}
                        onChange={() => handleCheckboxChange("secp", "no")}
                        className="form-check-input me-1"
                    />
                    <label>❌ No</label>
                </div>
            </div>

            <button
                type="button"
                className={`btn ${activeForm === "SECP" ? "btn-dark" : "btn-outline-dark"} w-100 text-start`}
                onClick={() => setActiveForm("SECP")}
                disabled={!secpEnabled}
            >
                SECP
            </button>
        </div>
    </div>
</div>


            </div>

            <div className="row justify-content-center">
                {/* DTS Form */}
                {activeForm === "DTS" && (
                    <div className="col-md-10 card p-4">
                        <h3 className="text-center">DTS Details</h3>
                        <div className="row">
                            {dtsFields.text.map((field) => (
                                <div className="col-md-4 mb-3" key={field}>
                                    <label className="form-label">{field.replace(/([A-Z])/g, " $1").trim()}:</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={dtsData[field] || ""}
                                        onChange={(e) => handleChange(e, setDtsData, "dtsData")}
                                        className="form-control"
                                    />
                                </div>
                            ))}

                            {dtsFields.date.map((field) => (
                                <div className="col-md-4 mb-3" key={field}>
                                    <label className="form-label">{field.replace(/([A-Z])/g, " $1").trim()}:</label>
                                    <input
                                        type="date"
                                        name={field}
                                        value={dtsData[field] || ""}
                                        onChange={(e) => handleChange(e, setDtsData, "dtsData")}
                                        className="form-control"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                            <button className="btn btn-danger" onClick={() => setActiveForm("")}>Exit</button>
                            <button   type="button" className="btn btn-success" onClick={() => handleSave(dtsData, "clientsDts", setDtsData, "dtsData")}>
                                Save DTS
                            </button>
                        </div>
                    </div>
                )}

                {/* SECP Form */}
                {activeForm === "SECP" && (
                    <div className="col-md-10 card p-4">
                        <h3 className="text-center">SECP Details</h3>
                        <div className="row">
                            {secpFields.text.map((field) => (
                                <div className="col-md-4 mb-3" key={field}>
                                    <label className="form-label">{field.replace(/([A-Z])/g, " $1").trim()}:</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={secpData[field] || ""}
                                        onChange={(e) => handleChange(e, setSecpData, "secpData")}
                                        className="form-control"
                                    />
                                </div>
                            ))}

                            {secpFields.date.map((field) => (
                                <div className="col-md-4 mb-3" key={field}>
                                    <label className="form-label">{field.replace(/([A-Z])/g, " $1").trim()}:</label>
                                    <input
                                        type="date"
                                        name={field}
                                        value={secpData[field] || ""}
                                        onChange={(e) => handleChange(e, setSecpData, "secpData")}
                                        className="form-control"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                            <button className="btn btn-danger" onClick={() => setActiveForm("")}>Exit</button>
                            <button   type="button" className="btn btn-success" onClick={() => handleSave(secpData, "clientsSecp", setSecpData, "secpData")}>
                                Save SECP
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClientsDtsSecpForm;
