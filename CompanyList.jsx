import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CompanyList({ companies, setCompanies }) { 
    const [showPopup, setShowPopup] = useState(false);
    const [deletedCompany, setDeletedCompany] = useState(null);

    const handleDelete = async (id, name) => {
        if (!id || id.length !== 24) {
            console.error("Invalid ID:", id);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/companies/delete/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Company deleted:', name);
                setCompanies(prevCompanies => prevCompanies.filter(company => company._id !== id)); 
                setDeletedCompany(name);
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 2000);
            } else {
                const errorData = await response.json();
                console.error('Error deleting company:', errorData);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <div className="container mt-4">
            {showPopup && (
                <div className="alert alert-danger text-center" role="alert">
                    Company "{deletedCompany}" has been deleted!
                </div>
            )}

            <ul className="list-group">
                {companies.map((company) => (
                    <li key={company._id} className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                        <div className="flex-grow-1">
                            <h5 className="mb-1">{company.companyName}</h5>
                            <p className="mb-1 text-muted">Representative: {company.repName}</p>
                        </div>
                        <div className="d-flex gap-2">
                            <Link to={`/details/${company._id}`} className="btn btn-info btn-sm">See Details</Link>
                            <Link to={`/clients/${company._id}`} className="btn btn-primary btn-sm">Clients</Link>
                            <button onClick={() => handleDelete(company._id, company.companyName)} className="btn btn-danger btn-sm">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CompanyList;
