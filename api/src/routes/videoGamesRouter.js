const { Router } = require("express");
const { Videogames, Genres} = require("../db");
const { Sequelize } = require("sequelize");
const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
const getApiInfo = async () => {
    const videoGameApi = await axios.get(
        `https://api.rawg.io/api/games?key=${API_KEY}`
    );
    let apiInfo = await gamesApi.data.map((games) => {
        return {
            id: games.id,
            nombre: games.name,
            descripcion: games.description, // Nota: Este campo podría no estar presente en la respuesta de la API
            plataforma: games.platforms.map(platform => platform.platform.name).join(', '), // Convertir array de plataformas a string
            imagen: games.background_image,
            rating: games.rating,
            genero: games.gender,
            fecha_lanzamiento: games.released
          };
        });
    return apiInfo;
  };

  const getAllGames = async () => {
    const gamesDb = await Games.findAll({
      include: [
        {
          model: Genres,
          attributes: ["nombre"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    const gamesFormateados = gamesDb.map((games) => {
        // Verificar si perro.Temperamentos está definido y no es null
        const genres = games.genres
          ? games.genres.map((gen) => gen.nombre).join(", ")
          : "";
    
        // Crear un nuevo objeto con el formato deseado
        return {
          id: games.id,
          nombre: games.nombre,
          genero: games.genero,
          descripcion: games.descripcion,
          plataforma: games.plataforma,
          imagen: games.imagen,
          rating: games.rating,
          fecha_lanzamiento: games.fecha_lanzamiento
        };
      });
      return gamesFormateados;
    };

    router.get("/", async (rq, rs) => {
        const source = rq.query.source;
        const name = rq.query.name;
        let data;
        if (source === "db") {
          data = await getAllGames();
        } else if (source === "api") {
          data = await getApiInfo();
        } else {
          const gamesDb = await getAllGames();
          const gamesApi = await getApiInfo();
          data = gamesDb.concat(gamesApi);
        }
        if (name !== null && name !== undefined) {
          data = data.filter((item) =>
            item.nombre.toLowerCase().includes(name.toLowerCase())
          );
        }
        rs.status(200).send(data);
      });

      router.get("/id/:id", async function (rq, rs, next) {
        try {
          const id = rq.params.id;
          const source = rq.query.source;
          let games;
          if (source === "db") {
            games = await getAllGames();
          } else if (source === "api") {
            games = await getApiInfo();
          } else {
            const gamesDb = await getAllGames();
            const gamesApi = await getApiInfo();
            games = gamesDb.concat(gamesApi);
          }
          if (id) {
            let gamesById = await games.filter((item) => item.id == id);
            if (gamesById.length) {
              rs.status(200).send(gamesById[0]);
            } else {
              rs.status(400).send({ info: "no se encontro el juego" });
            }
          }
        } catch (error) {
          next(error);
        }


      });
      router.post("/", async (rq, rs, next) => {
        try {
          const {
            imagen,
            nombre,
            descripcion,
            plataforma,
            fecha_lanzamiento,
            Rating,
            genero,
          } = rq.body;
          const newPerro = await games.create({
            imagen,
            nombre,
            descripcion,
            plataforma,
            fecha_lanzamiento,
            Rating,
            genero,
          });
          let genresDb = await genres.findAll({
            where: { id: { [Sequelize.Op.in]: genres } },
          });
      
          await newGames.addTemperamento(genresDb);
          rs.status(201).send({ info: "se ha creado un nuevo juego" });
        } catch (error) {
          next(error);
        }
      });
      
      module.exports = router;