import React from "react";
import "../styles/card.css";
import { useNavigate } from "react-router-dom";

const CardItem = ({ videoGame, source }) => {
  const navigate = useNavigate();

  if (!videoGame) {
    return <div>Cargando...</div>; 
  }

  const { nombre, imagen, genero, rating, id } = videoGame;

  const handleCardClick = () => {
    navigate(`/detail/${source}/${id}`);
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <div className="card-content">
        <p>
          <strong>Nombre:</strong> {nombre}
        </p>
        <p>
          <strong>Géneros:</strong> {genero}
        </p>
        <p>
          <strong>Rating:</strong> {rating}
        </p>
        <img src={imagen} alt={nombre} />
      </div>
    </div>
  );
};

export default CardItem;
