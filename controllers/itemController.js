const pool = require('../db');

exports.getAllItems = async (req, res) => {
  const result = await pool.query('SELECT * FROM items ORDER BY id');
  res.json(result.rows);
};

exports.createItem = async (req, res) => {
  const { nama_produk, harga, jumlah_unit, kategori_barang, deskripsi } = req.body;
  const result = await pool.query(
    `INSERT INTO items (nama_produk, harga, jumlah_unit, kategori_barang, deskripsi)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nama_produk, harga, jumlah_unit, kategori_barang, deskripsi]
  );
  res.status(201).json(result.rows[0]);
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { nama_produk, harga, jumlah_unit, kategori_barang, deskripsi } = req.body;
  const result = await pool.query(
    `UPDATE items SET nama_produk=$1, harga=$2, jumlah_unit=$3, kategori_barang=$4, deskripsi=$5
     WHERE id=$6 RETURNING *`,
    [nama_produk, harga, jumlah_unit, kategori_barang, deskripsi, id]
  );
  res.json(result.rows[0]);
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM items WHERE id = $1', [id]);
  res.status(204).send();
};
