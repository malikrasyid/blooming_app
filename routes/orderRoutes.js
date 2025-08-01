const express = require('express');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getOrderById,
  deleteOrder
} = require('../controllers/orderController');

const router = express.Router();

router.get('/', authenticateToken, getOrders);
router.post('/', authenticateToken, createOrder);
router.put('/:id', authenticateToken, authorizeRole('owner'), updateOrderStatus);
router.get('/:id', authenticateToken, getOrderById);
router.delete('/:id', authenticateToken, authorizeRole('owner'), deleteOrder);

module.exports = router;
