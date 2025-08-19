const pool = require('../db');
const { v2: cloudinary } = require("cloudinary");

exports.getAllItems = async (req, res) => {
  const result = await pool.query('SELECT * FROM items ORDER BY id');
  res.json(result.rows);
};

exports.createItem = async (req, res) => {
  try {
    const { nama_produk, harga, jumlah_unit, kategori_barang, deskripsi } = req.body;
    let photoUrl = null;
    let photoId = null;

    // kalau ada file, upload ke cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "items",
      });
      photoUrl = result.secure_url;
      photoId = result.public_id;
    }

    const dbRes = await pool.query(
      `INSERT INTO items (nama_produk, harga, jumlah_unit, kategori_barang, deskripsi, photo_url, photo_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nama_produk, harga, jumlah_unit, kategori_barang, deskripsi, photoUrl, photoId]
    );

    res.status(201).json(dbRes.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal membuat item" });
  }
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { nama_produk, harga, jumlah_unit, kategori_barang, deskripsi } = req.body;

  try {
    // cek data lama dulu
    const oldItemRes = await pool.query("SELECT * FROM items WHERE id=$1", [id]);
    if (oldItemRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Item tidak ditemukan" });
    }
    const oldItem = oldItemRes.rows[0];

    let photoUrl = oldItem.photo_url;
    let photoId = oldItem.photo_id;

    // kalau ada file baru
    if (req.file) {
      // hapus foto lama di cloudinary
      if (photoId) {
        await cloudinary.uploader.destroy(photoId);
      }

      // upload foto baru
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "items",
      });

      photoUrl = uploadResult.secure_url;
      photoId = uploadResult.public_id;
    }

    // update data
    const result = await pool.query(
      `UPDATE items 
       SET nama_produk=$1, harga=$2, jumlah_unit=$3, kategori_barang=$4, deskripsi=$5, photo_url=$6, photo_id=$7
       WHERE id=$8 RETURNING *`,
      [nama_produk, harga, jumlah_unit, kategori_barang, deskripsi, photoUrl, photoId, id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal update item" });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM items WHERE id = $1', [id]);
  res.status(204).send();
};
