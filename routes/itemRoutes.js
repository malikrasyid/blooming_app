const express = require('express');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');

const router = express.Router();

router.get('/', authenticateToken, getAllItems);
router.post('/', authenticateToken, authorizeRole('owner'), createItem);
router.put('/:id', authenticateToken, authorizeRole('owner'), updateItem);
router.delete('/:id', authenticateToken, authorizeRole('owner'), deleteItem);

module.exports = router;
