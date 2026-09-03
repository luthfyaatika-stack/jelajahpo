import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Wisata() {
  const [wisata, setWisata] = useState([]);
  const [loading, setLoading] = useState(true);

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
            </tr>
          </thead>

          <tbody>
            {wisata.map((item) => (
              <tr key={item.id_wisata}>
                <td>{item.id_wisata}</td>
                <td>{item.nama_wisata}</td>
                <td>{item.deskripsi}</td>
                <td>Rp {item.harga_tiket}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}