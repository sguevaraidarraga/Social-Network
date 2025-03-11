const express = require('express');
const app = express();
const port = 5000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor Express en funcionamiento!');
});

// Ruta para obtener datos
app.get('/', (req, res) => {
    res.json({ message: 'Aquí están tus datos', data: [1, 2, 3, 4] });
});

// Ruta para recibir datos
app.post('/api/data', (req, res) => {
    const receivedData = req.body;
    res.json({ message: 'Datos recibidos', receivedData });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});