const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');
const { error } = require('cros/common/logger');
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jelajahpo_db'
});

db.connect(err => {
    if (err) {
        console.error('Gagal konek kedatabase', err);
    } else {
        console.log('Berhasil konek kedatabase jelajahpo');
    }
});

/////////////////////////ROUTE GET WISATA/////////////////
app.get('/wisata', (req, res) => {
    const sql = 'SELECT * FROM wisata';
    db.query(sql, (err,results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});
////////////////////////ROUTE POST WISATA////////////////////////
app.post('wisata', (req, res) => {
    const { nama_wisata, deskripsi, harga_tiket, id_kategori } = req.body;

    if(!nama_wisata || !harga_tiket) {
        return res.status(400).json({ message: 'Nama Wisata dan harga_tiket wajib diisi' });
    }

    const sql = 'INSERT INTO wisata (nama_wisata, deskripsi, harga_tiket, id_kategori, tgl_input) VALUES (?, ?, ?, ?, NOW())';
    db.query(sql, [nama_wisata, deskripsi, harga_tiket, id_kategori], (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        res.json({
            message: ' List wisata berhasil ditambahkan!',
            id_wisata: result.insertId
        });
    });
});

///////////////////ROUTE GET KATEGORI///////////////////
app.get('/kategori', (req, res) => {
    const sql = 'SELECT * FROM kategori';
    db.query(sql, (err,results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

app.get('/', (req, res) => {
    res.send(' Selamat datang di jelajahpo API   ');
});

app.listen(PORT, () => {
    console.log(`Server Jelajahpo jalan di http://localhost:${PORT}`);
});