const pool = require('../db');

exports.getInvoices = async (req, res) => {
  const { role, id: userId } = req.user;

  const result = await pool.query(
    role === 'owner'
      ? `SELECT invoices.*, clients.nama_client FROM invoices
         JOIN clients ON clients.id = invoices.client_id`
      : `SELECT invoices.*, clients.nama_client FROM invoices
         JOIN clients ON clients.id = invoices.client_id
         WHERE clients.user_id = $1`,
    role === 'owner' ? [] : [userId]
  );

  res.json(result.rows);
};

exports.createInvoice = async (req, res) => {
  const { client_id, item_id, quantity } = req.body;

  const result = await pool.query(
    `INSERT INTO invoices (client_id, item_id, quantity)
     VALUES ($1, $2, $3) RETURNING *`,
    [client_id, item_id, quantity]
  );

  res.status(201).json(result.rows[0]);
};
exports.getInvoiceById = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT invoices.*, clients.nama_client FROM invoices
     JOIN clients ON clients.id = invoices.client_id
     WHERE invoices.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  res.json(result.rows[0]);
}