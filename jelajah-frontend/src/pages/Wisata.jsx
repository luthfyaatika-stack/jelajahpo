import { useEffect, useState } from "react";

export default function Wisata() {
    const [wisata, setWisata] = useState([]);
    const [loading, setLoading] = useState(true);

    const getWisata = async () => {
        try {
            const res = await fetch("http://localhost:5000/wisata");
            const data = await res.json();
            setWisata(data);
        } catch (err) {
            console.error("Gagal fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getWisata();
    }, []);
}