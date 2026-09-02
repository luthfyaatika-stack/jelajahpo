const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const { error } = require("cros/common/logger");

const app = express();
const PORT = 5000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== KONEKSI DATABASE ====================
const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "",
database: "jelajahpo_db"
});

db.connect((err) => {
if (err) {
console.error("Gagal konek ke database:", err);
} else {
console.log("Berhasil konek ke database jelajahpo_db");
}
});

// ==================== GET WISATA ====================
app.get("/wisata", (req, res) => {
const sql = "SELECT * FROM wisata";


db.query(sql, (err, results) => {
    if (err) {
        return res.status(500).json({
            error: err.sqlMessage
        });
    }

    return res.json(results);
});


});

// ==================== POST WISATA ====================//
app.post("/wisata", (req, res) => {
const {
nama_wisata,
deskripsi,
harga_tiket,
id_kategori
} = req.body;


if (!deskripsi ) {
    return res.status(400).json({
        message: "deskripsi wajib diisi"
    });
}

const sql = 'INSERT INTO wisata(nama_wisata, deskripsi, harga_tiket, id_kategori, tgl_input)VALUES (?, ?, ?, ?, NOW())';

db.query(
    sql,
    [nama_wisata, deskripsi, harga_tiket, id_kategori],
    (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.sqlMessage
            });
        }

        return res.status(201).json({
            message: "Wisata berhasil ditambahkan!",
            id_wisata: results.insertId
        });
    }
);
});

//======================PUT WISATA=============================//
app.put('/wisata/:id_wisata', (req, res) => {
    const { id_wisata } = req.params;
    const { nama_wisata, deskripsi, harga_tiket, id_kategori } = req.body;

    if (!nama_wisata || !harga_tiket) {
        return res.status(400).json({ message: 'Nama wisata dan harga_tiket wajib diisi' });
    }

    const sql = 'UPDATE wisata SET nama_wisata=?, deskripsi=?, harga_tiket=?, id_kategori=? WHERE id_wisata=?';
    db.query(sql, [nama_wisata, deskripsi, harga_tiket, id_kategori, id_wisata], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json({ message: 'Wisata berhasil diupdate!' });
    });
});
//=====================PUT WISATA=====================//

//====================DELETE WISATA====================//
app.delete('/wisata/:id_wisata', (req, res) => {
    const { id_wisata } = req.params;
    const sql = 'DELETE FROM wisata WHERE id_wisata';
    db.query(sql, [id_wisata], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json({ message: 'List wisata berhasil dihapus!' });
    });
});
//==================DELETE WISATA=======================//


// ==================== GET KATEGORI ====================
app.get("/kategori", (req, res) => {
const sql = "SELECT * FROM kategori";


db.query(sql, (err, results) => {
    if (err) {
        return res.status(500).json({
            error: err.sqlMessage
        });
    }

    return res.json(results);
});


});

// ==================== HALAMAN UTAMA ====================
app.get("/", (req, res) => {
res.send("Selamat datang di Jelajahpo API");
});

// ==================== JALANKAN SERVER ====================
app.listen(PORT, () => {
console.log(`Server Jelajahpo jalan di http://localhost:${PORT}`);
});
