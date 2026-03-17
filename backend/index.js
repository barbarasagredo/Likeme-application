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
    console.log("Error en la consulta POST /posts: " + error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let consulta = "DELETE from posts WHERE id = $1";
    let values = [id];
    const result = await pool.query(consulta, values);
    res.send("Post eliminado con éxito");
  } catch (error) {
    console.log("Error en consulta DELETE /posts: " + error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});
