const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
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
  database: "jelajahpo_db",
});

db.connect((err) => {
  if (err) {
    console.error("Gagal konek ke database:", err);
  } else {
    console.log("Berhasil konek ke database jelajahpo_db");
  }
});

// ==================== HALAMAN UTAMA ====================
app.get("/", (req, res) => {
  res.send("Selamat datang di Jelajahpo API");
});

// ==================== GET WISATA ====================
app.get("/wisata", (req, res) => {
  const sql = "SELECT * FROM wisata";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.sqlMessage,
      });
    }

    return res.json(results);
  });
});

// ==================== GET WISATA BERDASARKAN ID ====================
app.get("/wisata/:id_wisata", (req, res) => {
  const { id_wisata } = req.params;

  const sql = "SELECT * FROM wisata WHERE id_wisata = ?";

  db.query(sql, [id_wisata], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.sqlMessage,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Wisata tidak ditemukan",
      });
    }

    return res.json(results[0]);
  });
});

app.get('/wisata/:id_wisata', (req, res) => {
    const { id_wisata } = req.params;
    const sql = 'SELECT * FROM wisata WHERE id_wisata = ?';
    db.query(sql, [id_wisata], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});
// ==================== POST WISATA ====================
app.post("/wisata", (req, res) => {
  const {
    nama_wisata,
    deskripsi,
    harga_tiket,
    id_kategori,
  } = req.body;

  if (!nama_wisata || !deskripsi || !harga_tiket || !id_kategori) {
    return res.status(400).json({
      message: "Semua data wisata wajib diisi",
    });
  }

  const sql = `
    INSERT INTO wisata
    (nama_wisata, deskripsi, harga_tiket, id_kategori, tgl_input)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [nama_wisata, deskripsi, harga_tiket, id_kategori],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          error: err.sqlMessage,
        });
      }

      return res.status(201).json({
        message: "Wisata berhasil ditambahkan!",
        id_wisata: results.insertId,
      });
    }
  );
});

// ==================== UPDATE WISATA ====================
app.put("/wisata/:id_wisata", (req, res) => {
  const { id_wisata } = req.params;

  const {
    nama_wisata,
    deskripsi,
    harga_tiket,
    id_kategori,
  } = req.body;

  if (!nama_wisata || !deskripsi || !harga_tiket || !id_kategori) {
    return res.status(400).json({
      message: "Semua data wisata wajib diisi",
    });
  }

  const sql = `
    UPDATE wisata
    SET nama_wisata = ?,
        deskripsi = ?,
        harga_tiket = ?,
        id_kategori = ?
    WHERE id_wisata = ?
  `;

  db.query(
    sql,
    [
      nama_wisata,
      deskripsi,
      harga_tiket,
      id_kategori,
      id_wisata,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          error: err.sqlMessage,
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          message: "Wisata tidak ditemukan",
        });
      }

      return res.json({
        message: "Wisata berhasil diupdate!",
      });
    }
  );
});

// ==================== DELETE WISATA ====================
app.delete("/wisata/:id_wisata", (req, res) => {
  const { id_wisata } = req.params;

  const sql = "DELETE FROM wisata WHERE id_wisata = ?";

  db.query(sql, [id_wisata], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.sqlMessage,
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        message: "Wisata tidak ditemukan",
      });
    }

    return res.json({
      message: "Wisata berhasil dihapus!",
    });
  });
});

// ==================== GET KATEGORI ====================
app.get("/kategori", (req, res) => {
  const sql = "SELECT * FROM kategori";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.sqlMessage,
      });
    }

    return res.json(results);
  });
});

// ==================== DAFTAR PENGGUNA ====================
app.post("/pengguna", async (req, res) => {
  const { nama, email, password } = req.body;

  // Validasi
  if (!nama || !email || !password) {
    return res.status(400).json({
      message: "Nama, email, dan password wajib diisi!",
    });
  }

  // Cek apakah email sudah terdaftar
  const cekEmail = "SELECT * FROM pengguna WHERE email = ?";

  db.query(cekEmail, [email], async (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Terjadi kesalahan saat mengecek email",
      });
    }

    // Jika email sudah ada
    if (results.length > 0) {
      return res.status(400).json({
        message: "Email sudah terdaftar! Gunakan email lain.",
      });
    }

    try {
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      const sql = `
        INSERT INTO pengguna
        (nama, email, password)
        VALUES (?, ?, ?)
      `;

      db.query(
        sql,
        [nama, email, passwordHash],
        (err, result) => {
          if (err) {
            console.error(err);

            // Pengaman jika email ternyata sama
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(400).json({
                message: "Email sudah terdaftar!",
              });
            }

            return res.status(500).json({
              message: "Gagal mendaftarkan pengguna",
            });
          }

          return res.status(201).json({
            message: "Pendaftaran berhasil!",
            id_pengguna: result.insertId,
          });
        }
      );
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Terjadi kesalahan pada server",
      });
    }
  });
});

// ==================== JALANKAN SERVER ====================
app.listen(PORT, () => {
  console.log(`Server Jelajahpo jalan di http://localhost:${PORT}`);
});