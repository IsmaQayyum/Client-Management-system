const express = require('express');
const { createOrUpdateBill, getBillByCompanyId, updateBill, deleteBill, getAllBills } = require('../controllers/billController');

const router = express.Router();

router.post('/bills', createOrUpdateBill);
router.get('/bills/:companyId', getBillByCompanyId);
router.put('/bills/:id', updateBill);

router.delete('/bills/:id', deleteBill);
router.get('/bills', getAllBills);

module.exports = router;
