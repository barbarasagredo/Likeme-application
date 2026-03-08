/* eslint-disable react/prop-types */
function Post({
  post: { id, titulo, img, descripcion, likes },
  like,
  eliminarPost,
}) {
  return (
    <div className="card"> {/* Quitamos las clases col-sm-4 pesadas */}
      <img
        className="card-img-top"
        src={img}
        alt={titulo}
      />
      <div className="p-3 text-start"> {/* Alineación a la izquierda para estilo editorial */}
        <h4 className="card-title">{titulo}</h4>
        <p className="card-text">{descripcion}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <i
              onClick={() => like(id)}
              className={`fa-heart fa-xl ${
                likes ? "fa-solid" : "fa-regular"
              } fa-heart`} // Aseguramos que use fa-heart siempre
            ></i>
            <span className="ms-2 fw-bold">{likes}</span>
          </div>
          <i
            onClick={() => eliminarPost(id)}
            className="fa-solid fa-x"
          ></i>
        </div>
      </div>
    </div>
  );
}

export default Post;
