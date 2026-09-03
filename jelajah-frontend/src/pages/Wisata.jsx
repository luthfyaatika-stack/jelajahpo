import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Wisata() {
  const [wisata, setWisata] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================= NAVIGATE =======================
  const navigate = useNavigate();

  // ======================= GET WISATA =======================
  const getWisata = async () => {
    try {
      const res = await fetch("http://localhost:5000/wisata");
      const data = await res.json();

      console.log("DATA WISATA:", data);

      setWisata(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWisata();
  }, []);

  // ======================= HANDLE DELETE =======================
  const handleDelete = async (id) => {
    const yakin = window.confirm("Yakin ingin menghapus wisata ini?");

    if (!yakin) return;

    try {
      const res = await fetch(
        `http://localhost:5000/wisata/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        alert("Wisata berhasil dihapus!");

        // Ambil ulang data terbaru
        getWisata();
      } else {
        const data = await res.json();
        alert(data.message || "Gagal menghapus wisata");
      }
    } catch (err) {
      console.error("Error saat delete:", err);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  // ======================= HANDLE EDIT =======================
  const handleEdit = (id) => {
    navigate(`/wisata/edit/${id}`);
  };

  // ======================= TAMPILAN =======================
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Daftar Wisata JelajahPo</h2>

        <Link to="/wisata/tambah" className="btn btn-success">
          + Tambah Wisata
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Wisata</th>
              <th>Deskripsi</th>
              <th>Harga Tiket</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {wisata.map((item) => (
              <tr key={item.id_wisata}>
                <td>{item.id_wisata}</td>
                <td>{item.nama_wisata}</td>
                <td>{item.deskripsi}</td>
                <td>Rp {item.harga_tiket}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(item.id_wisata)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.id_wisata)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}