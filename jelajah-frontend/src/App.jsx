import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./componets/Layout";
import Home from "./pages/Home";
import Wisata from "./pages/Wisata";
import Kategori from "./pages/Kategori";
import Tentang from "./pages/Tentang";

export default function App() {
return ( <BrowserRouter> <Routes>
<Route path="/" element={<Layout />}>
<Route index element={<Home />} />
<Route path="wisata" element={<Wisata />} />
<Route path="kategori" element={<Kategori />} />
<Route path="tentang" element={<Tentang />} /> </Route> </Routes> </BrowserRouter>
);
}
