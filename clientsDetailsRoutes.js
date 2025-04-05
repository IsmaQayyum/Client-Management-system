const express = require('express');
const router = express.Router();
const clientsDetailsController = require('../controllers/ClientsDetailsController');


router.get('/clients-details/:clientId', clientsDetailsController.getClientDetails);

// ✅ Create New Client Details
router.post('/clients-details', clientsDetailsController.createClientDetails);

// ✅ Update Existing Client Details
router.put('/clients-details/:clientId', clientsDetailsController.updateClientDetails);

// ✅ Delete Client Details
router.delete('/clients-details/:clientId', clientsDetailsController.deleteClientDetails);

module.exports = router;
