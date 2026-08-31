const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(' Selamat datang di jelajahpo API   ');
});

app.listen(PORT, () => {
    console.log(`Server Jelajahpo jalan di http://localhost:${PORT}`);
});