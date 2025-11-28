const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DB_URL
});

// Probar la conexión
pool.connect()
    .then(() => console.log("Conectado a PostgreSQL"))
    .catch(err => console.error("Error al conectar a PostgreSQL", err));

module.exports = pool;
