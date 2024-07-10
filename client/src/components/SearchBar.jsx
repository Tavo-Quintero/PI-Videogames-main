import React, { useState } from "react";
import axios from "axios";


const SearchBar = ({ onSearch, searchSource }) => {
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 50) {
      setQuery(inputValue);
      setErrorMessage(""); // Limpiar el mensaje de error si es válido
    } else {
      setErrorMessage("Se ha superado el límite de 50 caracteres.");
    }
  };

  const handleSearch = async () => {
    try {
      if (query.length > 50) {
        setErrorMessage("Se ha superado el límite de 50 caracteres.");
        return;
      }

      const response = await axios.get(
        `http://localhost:3001/videogames?name=${query}&source=${searchSource}`
      );

      if (response.data.length === 0) {
        setErrorMessage("Lo sentimos, este videojuego no existe =(");
        onSearch([]);
      } else {
        onSearch(response.data);
      }

      setQuery("");
    } catch (error) {
      console.error("Error al realizar la búsqueda:", error);
      setErrorMessage("Error al buscar videojuego. Inténtalo de nuevo.");
    }
  };
  return (
    <div className="search-bar">   
      <div className="search-input">
        <input
          type="text"
          placeholder="Buscar videojuegos por nombre..."
          value={query}
          onChange={handleInputChange}
          
        />
        {errorMessage && (
        <div className="error-message-container">
          <p className="error-message">{errorMessage}</p>
        </div>
      )}
      </div>
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
}

export default SearchBar;
