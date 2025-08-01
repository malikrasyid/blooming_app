const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { addItemToOrder, getItemsByOrder, deleteItemFromOrder } = require('../controllers/orderItemController');

const router = express.Router();

router.post('/', authenticateToken, addItemToOrder);
router.get('/:orderId', authenticateToken, getItemsByOrder);
router.delete('/:orderId/:itemId', authenticateToken, deleteItemFromOrder);

module.exports = router;
