import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  setSortBy,
  setSortOrder,
  fetchVideoGames,
  setSearchResults,
  setFilterByGenre,
  setFilterBySource,
} from "../actions/navegadorAction";
import SearchBar from "./SearchBar";
import CardItem from "./CardItem";
import "../styles/HomePage.css";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoGames = useSelector((state) => state.navegador.videoGames);
  const currentPage = useSelector((state) => state.navegador.currentPage);
  const sortBy = useSelector((state) => state.navegador.sortBy);
  const sortOrder = useSelector((state) => state.navegador.sortOrder);
  const searchResults = useSelector((state) => state.navegador.searchResults);
  const filterByGenre = useSelector((state) => state.navegador.filterByGenre);
  const filterBySource = useSelector((state) => state.navegador.filterBySource);
  const itemsPerPage = 15;

  const [selectedOption, setSelectedOption] = useState("all");
  const [genreFilter, setGenreFilter] = useState("");
  const [generos, setGeneros] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");

  useEffect(() => {
    dispatch(fetchVideoGames());
    fetchGeneros();
  }, [dispatch]);

  useEffect(() => {
    handleFiltering();
  }, [
    sortBy,
    sortOrder,
    currentPage,
    videoGames,
    filterByGenre,
    filterBySource,
    genreFilter,
  ]);

  const fetchGeneros = async () => {
    try {
      const response = await axios.get("http://localhost:3001/genres/");
      setGeneros(response.data);
    } catch (error) {
      console.error("Error al obtener los géneros:", error);
    }
  };

  const handleFiltering = () => {
    let filteredVideoGames = [...videoGames];

    if (sortBy === "name") {
      filteredVideoGames.sort((a, b) => {
        const nameA = a.nombre.toLowerCase();
        const nameB = b.nombre.toLowerCase();
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    } else if (sortBy === "rating") {
      filteredVideoGames.sort((a, b) => {
        const ratingA = a.rating;
        const ratingB = b.rating;
        return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
      });
    }

    if (genreFilter) {
      filteredVideoGames = filteredVideoGames.filter((game) =>
        game.genero.toLowerCase().includes(genreFilter.toLowerCase())
      );
    }

    if (filterByGenre) {
      filteredVideoGames = filteredVideoGames.filter(
        (game) => game.genero === filterByGenre
      );
    }

    if (filterBySource !== "all") {
      filteredVideoGames = filteredVideoGames.filter(
        (game) => game.source === filterBySource
      );
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const results = filteredVideoGames.slice(indexOfFirstItem, indexOfLastItem);

  
    dispatch(setSearchResults(results));
  };

  const handleSearch = (data) => {
    dispatch(setSearchResults(data));
  };

  const fetchData = async (option) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/videogames/?source=${option}`
      );
      dispatch(setSearchResults(response.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (event) => {
    const option = event.target.value;
    setSelectedOption(option);
    fetchData(option);
  };

  const handleClickCreate = () => {
    navigate("/add");
  };

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
  };

  const handleOrderChange = (e) => {
    dispatch(setSortOrder(e.target.value));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleGenreChange = (e) => {
    // Validar caracteres especiales y longitud máxima
    const value = e.target.value;
    const cleanValue = value.replace(/[^\w\s]/gi, "").substring(0, 50);
    setGenreFilter(cleanValue);
  };

  const handleGenreSearch = () => {
    dispatch(setFilterByGenre(genreFilter));
  };

  const handleSourceFilterChange = (source) => {
    dispatch(setFilterBySource(source));
  };

  const handleBackToHome = () => {
    navigate("/home");
    window.location.reload();
  };

  return (
    <div className="home-page">
      <div className="navigation-button-container">
        <button className="create-button" onClick={handleBackToHome}>
          Volver al Inicio
        </button>
      </div>

      <h1>Bienvenido A Nuestro Catálogo</h1>

      <SearchBar onSearch={handleSearch} />

      <div className="home-page-container">
        <div className="filter-container">
          <label>Ordenar por:</label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="name">Nombre</option>
            <option value="rating">Rating</option>
          </select>

          <label>Orden:</label>
          <select value={sortOrder} onChange={handleOrderChange}>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>

        <div className="button-container">
          <button className="create-button" onClick={handleClickCreate}>
            Crear
          </button>
        </div>

        <div className="radio-options-container">
          <h2>Selecciona una opción:</h2>
          <label>
            <input
              type="radio"
              name="source"
              value="all"
              checked={selectedOption === "all"}
              onChange={handleChange}
            />
            Todos los Video Juegos
          </label>
          <label>
            <input
              type="radio"
              name="source"
              value="db"
              checked={selectedOption === "db"}
              onChange={handleChange}
            />
            Video Juegos de la BD
          </label>
          <label>
            <input
              type="radio"
              name="source"
              value="api"
              checked={selectedOption === "api"}
              onChange={handleChange}
            />
            Video Juegos del API
          </label>
        </div>

        <div className="genre-search-container">
          <h2>Filtrar por Género:</h2>
          <select
            className="modern-select"
            value={genreFilter}
            onChange={handleGenreChange}
          >
            <option value="">Seleccionar Género</option>
            {generos.map((genero) => (
              <option key={genero.id} value={genero.nombre}>
                {genero.nombre}
              </option>
            ))}
          </select>
          <button className="create-button" onClick={handleGenreSearch}>
            Filtrar
          </button>
        </div>
      </div>

      {searchMessage && <p className="error-message">{searchMessage}</p>}

      <div className="card-list">
        {searchResults.map((videoGame) => (
          <CardItem
            key={videoGame.id}
            videoGame={videoGame}
            source={selectedOption}
          />
        ))}
      </div>

      <div className="pagination">
        {Array.from(
          { length: Math.ceil(videoGames.length / itemsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default HomePage;
