import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditWisata() {
  const { id_wisata } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_wisata: "",
    deskripsi: "",
    harga_tiket: "",
    id_kategori: "",
  });

  const [loading, setLoading] = useState(true);

  // ==================== AMBIL DATA WISATA ====================
  useEffect(() => {
    const getDetailWisata = async () => {
      try {
        console.log("ID WISATA:", id_wisata);

        const res = await fetch(
          `http://localhost:5000/wisata/${id_wisata}`
        );

        console.log("STATUS SERVER:", res.status);

        const data = await res.json();

        console.log("DATA DARI SERVER:", data);

        if (!res.ok) {
          throw new Error(
            data.message ||
            data.error ||
            "Gagal mengambil data wisata"
          );
        }

        const wisata = Array.isArray(data) ? data[0] : data;

        setFormData({
          nama_wisata: wisata.nama_wisata || "",
          deskripsi: wisata.deskripsi || "",
          harga_tiket: wisata.harga_tiket || "",
          id_kategori: wisata.id_kategori || "",
        });

      } catch (err) {
        console.error("ERROR GET:", err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    getDetailWisata();
  }, [id_wisata]);

  // ==================== HANDLE INPUT ====================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================== SIMPAN PERUBAHAN ====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // KONFIRMASI SEBELUM UPDATE
    const yakin = window.confirm(
      "Yakin mau menyimpan perubahan ini?"
    );

    // JIKA KLIK CANCEL, DATA TIDAK DIKIRIM
    if (!yakin) {
      return;
    }

    // JIKA KLIK OK, BARU DATA DIUPDATE
    try {
      console.log("DATA DIKIRIM:", formData);

      const res = await fetch(
        `http://localhost:5000/wisata/${id_wisata}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      console.log("RESPONSE UPDATE:", data);

      if (!res.ok) {
        alert(
          data.message ||
          data.error ||
          "Gagal memperbarui wisata"
        );
        return;
      }

      alert("Wisata berhasil diperbarui!");

      navigate("/wisata");

    } catch (err) {
      console.error("ERROR UPDATE:", err);

      alert("Terjadi kesalahan saat memperbarui wisata");
    }
  };

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="container mt-4">
        Loading...
      </div>
    );
  }

  // ==================== TAMPILAN ====================
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Edit Wisata</h2>

      <form
        onSubmit={handleSubmit}
        className="card p-4 shadow-sm"
      >
        <div className="mb-3">
          <label className="form-label">
            Nama Wisata
          </label>

          <input
            type="text"
            name="nama_wisata"
            value={formData.nama_wisata}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Deskripsi
          </label>

          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            className="form-control"
            rows="4"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Harga Tiket
          </label>

          <input
            type="number"
            name="harga_tiket"
            value={formData.harga_tiket}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            ID Kategori
          </label>

          <input
            type="number"
            name="id_kategori"
            value={formData.id_kategori}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-success me-2"
          >
            Simpan Perubahan
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/wisata")}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}