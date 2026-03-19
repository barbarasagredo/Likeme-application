const express = require("express");
const pool = require("./database/db");
const cors = require("cors");

const app = express();

app.use(express.json());
const corsOptions = {
  origin: [
    "https://barbarasagredo.github.io",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

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

app.put("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, img, descripcion, action } = req.body;

    let consulta;
    let values;

    if (action === "like") {
      consulta =
        "UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING *";
      values = [id];
    } else if (titulo && img && descripcion) {
      consulta =
        "UPDATE posts SET titulo = $1, img = $2, descripcion = $3 WHERE id = $4";
      values = [titulo, img, descripcion, id];
    } else {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message:
          "Debe enviar todos los campos (titulo, img, descripcion) o action='like'",
      });
    }
    const result = await pool.query(consulta, values);
    res.status(200).json({
      message:
        action === "like"
          ? "Like agregado con éxito"
          : "Post actualizado con éxito",
      post: result.rows[0],
    });
  } catch (error) {
    console.log("Error en la consulta PUT /posts: " + error);
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
