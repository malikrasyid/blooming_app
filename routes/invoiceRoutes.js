const express = require('express');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const { getInvoices, createInvoice, getInvoiceById } = require('../controllers/invoiceController');

const router = express.Router();

router.get('/', authenticateToken, getInvoices);
router.post('/', authenticateToken, authorizeRole('owner'), createInvoice);
router.get('/:id', authenticateToken, getInvoiceById);

module.exports = router;
