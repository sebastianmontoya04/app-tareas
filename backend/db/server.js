const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.NODE_ENV === "production"
        ? process.env.DATABASE_URL  // en Railway
        : process.env.DB_URL,       // en local
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

// Probar la conexión
pool.connect()
    .then(() => console.log("Conectado a PostgreSQL"))
    .catch(err => console.error("Error al conectar a PostgreSQL", err));

module.exports = pool;
