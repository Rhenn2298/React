// Importaciones
require('dotenv').config(); // Carga las variables de entorno desde un archivo .env 

const express = require('express'); // Framework para manejar rutas y servidores en Node.js
const cors = require('cors'); // Middleware para permitir comunicación con React
const mysql = require('mysql2'); // Librería para conectarse a MySQL


const app = express(); // Creamos una instancia de Express
const missionRoutes = require('./api/mission');

// Middleware para permitir solicitudes desde el frontend (React)
app.use(cors());
// Middleware para que Express pueda procesar JSON en las solicitudes
app.use(express.json());
//ruta de misiones
app.use('/mission', missionRoutes);




// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,  // Dirección del servidor MySQL (localhost si es en tu PC)
    user: process.env.DB_USER,       // Usuario de MySQL (por defecto "root")
    password: process.env.DB_PASSWORD, // Cambia esto por la contraseña de tu MySQL
    database: process.env.DB_NAME  // Nombre de la base de datos
});

// Conectamos a MySQL
db.connect(err => {
    if (err) {
        console.error('Error de conexión a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
});
module.exports = db;
// Definimos el puerto en el que correrá el servidor
const PORT = 5000;

// Iniciamos el servidor y escuchamos en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
});
