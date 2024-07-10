import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/DeatailPage.css";
import { useNavigate } from "react-router-dom";

const DetailPage = () => {
  const navigate = useNavigate();
  const { id, query } = useParams();
  const [gameDetail, setGameDetail] = useState(null);

  const onClickVolver = () => {
    navigate("/home");
  };

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/videogames/id/${id}?source=${query}`
        );
        setGameDetail(response.data); // Guardar los detalles del videojuego
      } catch (error) {
        console.error(
          "Error al obtener los detalles del videojuego:",
          error
        );
        // Manejar errores de solicitud aquí
      }
    };

    fetchGameDetail(); // Cargar los detalles del videojuego al montar el componente
  }, [id]); // Se ejecuta cada vez que cambia el parámetro "id"

  if (!gameDetail) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras se obtienen los detalles
  }

  const { nombre, imagen, plataforma, rating, genero, fecha_lanzamiento } = gameDetail;

  // Verificar si genero existe antes de dividir
 

  return (
    <div className="background-detail">
      <div className="detail-page">
        <h1>Detalle Videojuego</h1>
        <h2>Nombre: {nombre}</h2>
        <img src={imagen} alt={nombre} />
  
        <div className="detail-field">
          <label>Plataforma:</label>
          <input type="text" value={plataforma} readOnly />
        </div>
  
        <div className="detail-field">
          <label>Rating:</label>
          <input type="text" value={rating} readOnly />
        </div>
  
        <div className="detail-field">
          <label>Género:</label>
          <input type="text" value={genero} readOnly />
        </div>
  
        <div className="detail-field">
          <label>Fecha de lanzamiento:</label>
          <input type="text" value={fecha_lanzamiento} readOnly />
        </div>
  
        <div className="button-container">
          <button className="create-button" onClick={onClickVolver}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
