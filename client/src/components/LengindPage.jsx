// components/LandingPage.js
import React from "react";
import { useDispatch } from "react-redux";
import { goToHome } from "../actions/navegadorAction"; // Asegúrate de importar desde acciones, no desde reducer
import "../styles/LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(goToHome());
    navigate("/home");
  };

  return (
    <div className="background-container">
      <div className="container landing-page">
        <h1>Bienvenido A Nuestro Catalogo De Video Juegos</h1>
        <button onClick={handleClick}>Catalogo</button>
      </div>
    </div>
  );
};

export default LandingPage;
