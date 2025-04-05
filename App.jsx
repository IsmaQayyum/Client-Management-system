import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ClientDetails from './Components/ClientDetails';
import Clients from './Components/Clients';
import CompanyDetail from './Components/CompanyDetail';
import CompanyList from './Components/CompanyList';
import Form from './Components/Form';
import FullReport from './Components/FullReport';
import FullClientsReport from './Components/FullClientsReport';




function App() {
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/companies/all')
            .then(res => res.json())
            .then(data => setCompanies(data))
            .catch(err => console.error('Error fetching companies:', err));
    }, []);


    const addCompany = (company) => {
        setCompanies([...companies, company]);
        console.log('Companies List:', [...companies, company]);
    };

   
    const deleteCompany = (index) => {
        const updatedCompanies = companies.filter((_, i) => i !== index);
        setCompanies(updatedCompanies);
        console.log('Updated Companies List:', updatedCompanies);
    };

    const handleUpdate = (index, clientIndex, formData) => {
        console.log('Updated data:', index, clientIndex, formData);

        const updatedCompanies = [...companies];
        if (updatedCompanies[index] && updatedCompanies[index].clients[clientIndex]) {
            updatedCompanies[index].clients[clientIndex] = formData;
            setCompanies(updatedCompanies);
        }
    };

    return (
        <div>
     
            <Routes>
                <Route path="/" element={
                    <>
                        <Form addCompany={addCompany} />
                        <CompanyList companies={companies} setCompanies={setCompanies} deleteCompany={deleteCompany} />
                    </>
                } />
                <Route path="/clients/:id" element={<Clients />} />
                 <Route path="/details/:index" element={<CompanyDetail companies={companies} setCompanies={setCompanies} />} />
    <Route path="/clients/:id" element={<Clients companies={companies} setCompanies={setCompanies} />} />
    <Route path="/client-details/:id" element={<ClientDetails companies={companies} setCompanies={setCompanies} />} />
    <Route path="/report/:companyId" element={<FullReport />} />
    <Route path="/client-report/:clientId" element={<FullClientsReport />} />

            </Routes>
        </div>
    );
}

export default App;
