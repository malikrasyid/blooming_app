const express = require('express');
const { getAllClients, createClient, updateClient, deleteClient } = require('../controllers/clientController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getAllClients);
router.post('/', authenticateToken, authorizeRole('owner'), createClient);
router.put('/:id', authenticateToken, authorizeRole('owner'), updateClient);
router.delete('/:id', authenticateToken, authorizeRole('owner'), deleteClient);

module.exports = router;
