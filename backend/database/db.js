const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: 5433,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  allowExitOnIdle: true,
});

const getHealth = async () => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    console.log(`Base de datos funcionando y conectada a las ${rows[0].now}`);
  } catch (error) {
    console.error("Error conectando a la base de datos:", error.message);
  }
};

getHealth();

module.exports = pool;
