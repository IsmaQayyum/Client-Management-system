import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BillAmountForm from "../Components/BillAmountForm";
import Buttons from "../Components/Buttons";
import DtsSecpForm from "../Components/DtsSecpForm";

function CompanyDetail() {
    const [serviceStatuses, setServiceStatuses] = useState({});
    const navigate = useNavigate();
    const url = window.location.pathname;
    const id = url.split("/details/")[1] || null;
    const companyId = id;

 
    const [formData, setFormData] = useState({
        companyId: id || "",
        companyName: "",
        address: "",
        coreg: "",
        reference: "",
        status: "CO",
        contact: "",
        repName: "",
        ntn: "",
        nic: "",
        email: "",
        details: "",
    });

    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {
        if (!id) return;
    
        console.log(`📡 Fetching details for companyId: ${id}`);
    
        setFormData(prev => ({ ...prev, companyId: id }));
    
        axios.get(`http://localhost:5000/api/companyDetails/${id}`)
            .then((response) => {
                console.log("✅ Data fetched:", response.data);
                setFormData(response.data);
                localStorage.setItem(`company_${id}`, JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error("❌ Fetch error:", error);
                if (error.response?.status === 404) {
                    axios.get(`http://localhost:5000/api/companies/${id}`)
                        .then((companyResponse) => {
                            console.log("ℹ️ Default company data:", companyResponse.data);
                            const defaultDetails = {
                                companyId: id,
                                companyName: companyResponse.data.companyName || "N/A",
                                repName: companyResponse.data.repName || "N/A",
                                address: "",
                                email: "",
                                details: "",
                            };
    
                            // 🛠 Default data insert karo
                            axios.post(`http://localhost:5000/api/companyDetails`, defaultDetails)
                                .then((createResponse) => {
                                    console.log("✅ Default details created:", createResponse.data);
                                    setFormData(createResponse.data);
                                    localStorage.setItem(`company_${id}`, JSON.stringify(createResponse.data));
                                })
                                .catch((createError) => console.error("❌ Error creating details:", createError));
                        })
                        .catch((fetchError) => console.error("❌ Error fetching company:", fetchError));
                }
            });
    }, [id]);
    

 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

 
    const handleSave = async (e) => {
        e.preventDefault();

        console.log("📤 Form Data Before Save:", formData); 
        if (!formData.companyId || !formData.companyName) {
            console.error("⚠️ Missing Data:", formData);
            alert("❌ Company ID and Name are required!");
            return;
        }

        try {
            console.log("📤 Sending Company Data:", formData);
            const response = await axios.post("http://localhost:5000/api/companyDetails", formData);
            console.log("✅ Company Details Saved:", response.data);
            alert("✅ Data saved successfully!");
            navigate(`/report/${formData.companyId}`);
        } catch (error) {
            console.error("❌ Save error:", error.response?.data || error.message);
            alert(`❌ Failed to save data: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg p-4">
                <h2 className="text-primary text-center mb-4">
                    {id ? `${formData.companyName}` : "Add New Company"}
                </h2>
                <div className="card-body">
                    <div className="row">
                    
                        {["companyName", "repName", "contact", "address", "email", "coreg", "reference", "status", "ntn", "nic"].map((field, index) => (
                            <div className="col-md-4 mb-3" key={index}>
                                <label className="form-label fw-bold">{field.replace(/([A-Z])/g, " $1").toUpperCase()}:</label>
                                <input type="text" name={field} value={formData[field] || ""} onChange={handleChange} className="form-control" />
                            </div>
                        ))}
                    </div>

               
                    <div className="row">
                        <div className="col-12">
                        <Buttons companyId={id} onServiceStatusChange={setServiceStatuses} />
<DtsSecpForm companyId={id} onServiceStatusChange={setServiceStatuses} />
<BillAmountForm companyId={id} checkboxes={serviceStatuses} />





                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <button className="btn btn-primary btn-lg" onClick={handleSave}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="alert alert-success text-center mt-3">
                    ✅ Changes saved successfully!
                </div>
            )}
        </div>
    );
}

export default CompanyDetail;
