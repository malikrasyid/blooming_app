const pool = require('../db');

exports.getAllClients = async (req, res) => {
  const result = await pool.query('SELECT * FROM clients');
  res.json(result.rows);
};

exports.createClient = async (req, res) => {
  const { nama_client, email, nomor_telepon, alamat } = req.body;
  const result = await pool.query(
    `INSERT INTO clients (nama_client, email, nomor_telepon, alamat)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nama_client, email, nomor_telepon, alamat]
  );
  res.status(201).json(result.rows[0]);
};
exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { nama_client, email, nomor_telepon, alamat } = req.body;

  const result = await pool.query(
    `UPDATE clients SET nama_client=$1, email=$2, nomor_telepon=$3, alamat=$4
     WHERE id=$5 RETURNING *`,
    [nama_client, email, nomor_telepon, alamat, id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Client not found' });
  }

  res.json(result.rows[0]);
}
exports.deleteClient = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Client not found' });
  }

  res.status(204).send();
}