import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; // ✅ Added useNavigate
import ClientButton from '../Components/ClientsButton';
import ClientsDtsSecpForm from '../Components/ClientsDtsSecpForm';
import ClientBillComponent from '../Components/ClientBillComponent';

function ClientDetails() {
    const { id } = useParams(); // ✅ Client ID from URL
    const location = useLocation(); // ✅ Get current URL location
    const navigate = useNavigate(); // ✅ Hook for navigation
    const [serviceCheckboxes, setServiceCheckboxes] = useState({});
    const queryParams = new URLSearchParams(location.search);
    const clientNameFromURL = queryParams.get("name");

    console.log("Client ID from URL:", id, "Client Name from URL:", clientNameFromURL);

    // ✅ Default Client Details State
    const [formData, setFormData] = useState({
        clientId: '',
        clientName: clientNameFromURL || '', 
        address: '',
        contact: '',
        email: '',
        ntn: '',
        reference: '',
        coreg: '',
        status: 'CO',
        repName: '',
        nic: ''
    });

    const [loading, setLoading] = useState(true);

    // ✅ Fetch Client Details from Backend
    useEffect(() => {
        if (!id) {
            console.error("❌ Client ID is missing in URL!");
            return;
        }
    
        fetch(`http://localhost:5000/api/clients-details/${id}`)
            .then(res => res.json())
            .then(data => {
                setFormData(prev => ({
                    ...prev,
                    ...data,
                    clientId: id, // ✅ Always ensure clientId is set
                    clientName: clientNameFromURL || data.clientName || '',
                }));
                setLoading(false);
            })
            .catch(err => {
                console.error("❌ Fetch error:", err);
                setLoading(false);
            });
    }, [id , clientNameFromURL]);
    

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
            clientId: prev.clientId || id, // ✅ Ensure clientId remains unchanged
        }));
    };
    

    const handleSave = async (e) => {
        e.preventDefault();

        // ✅ Ensure clientId is present
        if (!formData.clientId) {
            console.error("❌ clientId is missing from formData");
            alert("Client ID is required to save details!");
            return;
        }

        const clientId = formData.clientId || id;

        const url = `http://localhost:5000/api/clients-details/${clientId}`;
        const method = "PUT";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const text = await response.text();
            console.log("Raw response from backend:", text);

            const data = JSON.parse(text);

            if (response.ok) {
                alert("✅ Client details saved successfully!");
                
                // ✅ Redirect to FullClientsReport page
                navigate(`/client-report/${clientId}`);
            } else {
                alert(`❌ Error: ${data.message || "Failed to update client details"}`);
            }
        } catch (error) {
            console.error("❌ Error saving client details:", error);
            alert("❌ Failed to save client details.");
        }
    };

    
    if (loading) {
        return <div className="text-center">Loading client details...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h2 className="text-primary text-center mb-4">
                    {formData.clientName ? `${formData.clientName} Details` : "Edit Client Details"}
                </h2>

                <form onSubmit={handleSave}>
                    <div className="row">
                        {/* First Row */}
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Client Name:</label>
                            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} className="form-control" required />
                        </div>

                        <div className="col-md-8 mb-3">
                            <label className="form-label fw-bold">Address:</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Contact:</label>
                            <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="form-control" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">NIC:</label>
                            <input type="text" name="nic" value={formData.nic} onChange={handleChange} className="form-control" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Co-Reg:</label>
                            <input type="text" name="coreg" value={formData.coreg} onChange={handleChange} className="form-control" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Status:</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                                <option value="CO">CO</option>
                                <option value="AOP">AOP</option>
                                <option value="IND">IND</option>
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">NTN:</label>
                            <input type="text" name="ntn" value={formData.ntn} onChange={handleChange} className="form-control" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Reference:</label>
                            <input type="text" name="reference" value={formData.reference} onChange={handleChange} className="form-control" />
                        </div>
                    </div>

                    {/* Other Components */}
                    <ClientButton onServiceChange={(checkboxes) => setServiceCheckboxes(checkboxes)} />
                    <ClientsDtsSecpForm onServiceChange={setServiceCheckboxes} />

                    <ClientBillComponent clientId={id} serviceCheckboxes={serviceCheckboxes} />
                    {/* Save Button */}
                    <div className="d-flex justify-content-center mt-4">
                        <button type="submit" className="btn btn-success w-50">Save Client Details</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ClientDetails;
