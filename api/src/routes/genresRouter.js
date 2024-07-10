const { Router } = require("express");
const { Videogame, Genres } = require("../db");
const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;

const router = Router();

const getGenresFromAPI = async () => {
  try {
    const response = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);
    return response.data.results.map(genre => ({
      nombre: genre.name 
    }));
  } catch (error) {
    console.error("Error al obtener los géneros de la API:", error);
    return [];
  }
};

const storeGenresInDatabase = async (genres) => {
    try {
      for (const genre of genres) {
        console.log("Storing genre:", genre);  // Agrega esta línea para depuración
        await Genres.findOrCreate({
          where: { nombre: genre.nombre }, 
          defaults: { nombre: genre.nombre },
        });
      }
    } catch (error) {
      console.error("Error al almacenar los géneros en la base de datos:", error);
    }
  };

const getAllGenres = async () => {
  try {
   
      const genres = await getGenresFromAPI();
      await storeGenresInDatabase(genres);
    

    return await Genres.findAll();
  } catch (error) {
    console.error("Error al obtener y almacenar los géneros:", error);
    return [];
  }
};

router.get("/", async (req, res) => {
  const genres = await getAllGenres();
  res.status(200).json(genres);
});

module.exports = router;
