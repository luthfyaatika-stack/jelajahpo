const express = require('express');
const app = express();
const mysql = require('mysql2');
const PORT = 5000;

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