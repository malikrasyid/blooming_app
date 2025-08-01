const pool = require('../db');

// Tambahkan item ke order
exports.addItemToOrder = async (req, res) => {
  const { order_id, item_id, quantity } = req.body;

  // Ambil harga saat ini dari items
  const item = await pool.query('SELECT harga FROM items WHERE id = $1', [item_id]);
  if (item.rowCount === 0) return res.status(404).json({ error: 'Item not found' });

  const harga = item.rows[0].harga;

  const result = await pool.query(
    `INSERT INTO order_items (order_id, item_id, quantity, harga_satuan)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [order_id, item_id, quantity, harga]
  );

  res.status(201).json(result.rows[0]);
};

// Tampilkan item dalam order tertentu
exports.getItemsByOrder = async (req, res) => {
  const { orderId } = req.params;

  const result = await pool.query(
    `SELECT oi.*, i.nama_produk
     FROM order_items oi
     JOIN items i ON i.id = oi.item_id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  res.json(result.rows);
};
// Hapus item dari order
exports.deleteItemFromOrder = async (req, res) => {
  const { orderId, itemId } = req.params;

  const result = await pool.query(
    'DELETE FROM order_items WHERE order_id = $1 AND item_id = $2 RETURNING *',
    [orderId, itemId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Item not found in order' });
  }

  res.status(204).send();
}