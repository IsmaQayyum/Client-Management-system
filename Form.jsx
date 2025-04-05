import React, { useState } from 'react';

function Form({ addCompany }) {
    const [companyName, setCompanyName] = useState('');
    const [repName, setRepName] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (companyName && repName) {
            const newCompany = { companyName, repName, details: null };
    
            try {
                const response = await fetch('http://localhost:5000/api/companies/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCompany)
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log('Company added:', data);
                    addCompany(data.company);
                    setCompanyName('');
                    setRepName('');
                    setShowPopup(true);
                    setTimeout(() => setShowPopup(false), 2000);
                } else {
                    const errorData = await response.json();
                    console.error('Error adding company:', errorData);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
    };

    return (
        <div className="container mt-4 d-flex flex-column align-items-center">
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-lg bg-light w-100 w-md-75 w-lg-50">
                <h2 className="text-center text-primary mb-3">Client Management System</h2>
                <div className="mb-3">
                    <label className="form-label">Company Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter company name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Representative Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter representative name"
                        value={repName}
                        onChange={(e) => setRepName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success w-100">Add Company</button>
            </form>
            
            {showPopup && (
                <div className="mt-3 p-2 text-center bg-success text-white rounded shadow-lg">
                    <h5>Company Added Successfully!</h5>
                </div>
            )}
        </div>
    );
}

export default Form;
