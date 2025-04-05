const Company = require('../models/Company');
const Client = require('../models/Client');
const CompanyDetails = require('../models/CompanyDetails');

exports.createCompany = async (req, res) => {
    try {
        const { companyName, repName } = req.body;

       
        const company = new Company({ companyName, repName, clients: [], details: null });
        await company.save();
       
        const companyDetails = new CompanyDetails({ companyId: company._id });
        await companyDetails.save();

        company.details = companyDetails._id;
        await company.save();

        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.find()
            .populate('clients')
            .populate('details');

        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        
        await Client.deleteMany({ companyId });
       
        await CompanyDetails.deleteOne({ companyId });
        
        await Company.findByIdAndDelete(companyId);

        res.status(200).json({ message: "Company and its clients deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updateCompany = async (req, res) => {
    try {
        console.log('Request body:', req.body);  // Log the request data
        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json(updatedCompany);
    } catch (error) {
        console.error('Error updating company:', error); // Log the error details
        res.status(500).json({ message: 'Error updating company', error: error.message });
    }
};

