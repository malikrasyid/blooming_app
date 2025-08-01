const pool = require('../db');

exports.createOrder = async (req, res) => {
  const { catatan } = req.body;
  const userId = req.user.id;

  const result = await pool.query(
    `INSERT INTO orders (user_id, status, catatan)
     VALUES ($1, 'pending', $2) RETURNING *`,
    [userId, catatan]
  );

  res.status(201).json(result.rows[0]);
};

exports.getOrders = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  const result = await pool.query(
    role === 'owner'
      ? 'SELECT * FROM orders ORDER BY id DESC'
      : 'SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC',
    role === 'owner' ? [] : [userId]
  );

  res.json(result.rows);
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await pool.query(
    `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );

  res.json(result.rows[0]);
};
exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(result.rows[0]);
};
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  await pool.query('DELETE FROM orders WHERE id = $1', [id]);
  res.status(204).send();
};