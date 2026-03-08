const express = require("express");
const pool = require("./database/db");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("Servidor encendido en puerto 3000");
});

app.get("/posts", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM posts");
    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo posts:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { titulo, img, descripcion } = req.body;
    const values = [titulo, img, descripcion];
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion) VALUES ($1, $2, $3)",
      values,
    );
    res.send("Post añadido con éxito");
  } catch (error) {
    res.json({
      error: error.code,
      message: error.message,
    });
  }
});
