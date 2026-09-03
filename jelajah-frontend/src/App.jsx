import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./componets/Layout";
import Home from "./pages/Home";
import Wisata from "./pages/Wisata";
import AddWisata from "./pages/AddWisata";
import Tentang from "./pages/Tentang";
import Kategori from "./pages/Kategori";
import EditWisata from "./pages/EditWisata";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="wisata" element={<Wisata />} />
          <Route path="wisata/tambah" element={<AddWisata />} />
          <Route path="tentang" element={<Tentang />} />
          <Route path="kategori" element={<Kategori />} />
          <Route path="/wisata/edit/:id_wisata" element={<EditWisata />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}