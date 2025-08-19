const express = require('express');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const upload = require('../middlewares/upload'); 

const router = express.Router();

router.get('/', authenticateToken, getAllItems);
router.post(
  '/',
  authenticateToken,
  authorizeRole('owner'),
  upload.single('image'),
  createItem
);
router.put(
  '/:id',
  authenticateToken,
  authorizeRole('owner'),
  upload.single('image'),
  updateItem
);
router.delete('/:id', authenticateToken, authorizeRole('owner'), deleteItem);

module.exports = router;
