const { Router } = require("express");
const { Videogame, Genres } = require("../db");
const { Sequelize } = require("sequelize");
const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;

const router = Router();

const getApiInfo = async () => {
    const videoGameApi = await axios.get(`https://api.rawg.io/api/games?page_size=50&page=1&key=${API_KEY}`);
    let apiInfo = await videoGameApi.data.results.map((games) => {
        return {
            id: games.id,
            nombre: games.name,
            descripcion: games.description,
            plataforma: games.platforms.map(platform => platform.platform.name).join(', '),
            imagen: games.background_image,
            rating: games.rating,
            genero: games.genres.map(genre => genre.name).join(', '),
            fecha_lanzamiento: games.released
        };
    });
    const videoGameApi2 = await axios.get(`https://api.rawg.io/api/games?page_size=50&page=2&key=${API_KEY}`);
    let apiInfo2 = await videoGameApi2.data.results.map((games) => {
        return {
            id: games.id,
            nombre: games.name,
            descripcion: games.description,
            plataforma: games.platforms.map(platform => platform.platform.name).join(', '),
            imagen: games.background_image,
            rating: games.rating,
            genero: games.genres.map(genre => genre.name).join(', '),
            fecha_lanzamiento: games.released
        };
    });
    return apiInfo.concat(apiInfo2);

};

const getAllGames = async () => {
    const gamesDb = await Videogame.findAll({
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
        const genres = games.genres ? games.genres.map((gen) => gen.nombre).join(", ") : "";
        return {
            id: games.id,
            nombre: games.nombre,
            genero: genres,
            descripcion: games.descripcion,
            plataforma: games.plataforma,
            imagen: games.imagen,
            rating: games.rating,
            fecha_lanzamiento: games.fecha_lanzamiento
        };
    });
    return gamesFormateados;
};

const getGameById = async (id) => {
    try {
        const gameFromDb = await Videogame.findByPk(id, {
            include: [
                {
                    model: Genres,
                    attributes: ['nombre'],
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        if (gameFromDb) {
        
            return {
                id: gameFromDb.id,
                nombre: gameFromDb.nombre,
                descripcion: gameFromDb.descripcion,
                plataforma: gameFromDb.plataforma,
                imagen: gameFromDb.imagen,
                rating: gameFromDb.rating,
                genero: gameFromDb.genres.map(genre => genre.nombre).join(', '),
                fecha_lanzamiento: gameFromDb.fecha_lanzamiento
            };
        
        }

        const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
        const games= response.data;
        return {
            id: games.id,
            nombre: games.name,
            descripcion: games.description,
            plataforma: games.platforms.map(platform => platform.platform.name).join(', '),
            imagen: games.background_image,
            rating: games.rating,
            genero: games.genres.map(genre => genre.name).join(', '),
            fecha_lanzamiento: games.released
        };

    } catch (error) {
        console.error(error);
    }
};

const getGamesAPIByName = async (name) => {
    try {

        const response = await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`);
        const gamesFromApi = response.data.results.map(game => ({
            id: game.id,
            nombre: game.name,
            genero: game.genres.map(genre => genre.name).join(', '),
            descripcion: game.description,
            plataforma: game.platforms.map(platform => platform.platform.name).join(', '),
            imagen: game.background_image,
            rating: game.rating,
            fecha_lanzamiento: game.released
        }));
        console.log(gamesFromApi)
        return Array.isArray(gamesFromApi) ? gamesFromApi : [];

    } catch (error) {
        console.error(error);
        return []; 
    }
};

const getGamesDBByName = async (name) => {
    try {
        const gamesFromDb = await Videogame.findAll({
            where: {
                nombre: {
                    [Sequelize.Op.iLike]: `%${name}%`,
                },
            },
            include: [
                {
                    model: Genres,
                    attributes: ['nombre'],
                    through: {
                        attributes: [],
                    },
                },
            ],
        });

        // Transforma los resultados para incluir `genero`
        const transformedGamesFromDb = gamesFromDb.map(game => {
            return {
                id: game.id,
                nombre: game.nombre,
                descripcion: game.descripcion,
                plataforma: game.plataforma,
                imagen: game.imagen,
                rating: game.rating,
                fecha_lanzamiento: game.fecha_lanzamiento,
                genero: game.genres.map(genre => genre.nombre).join(', ') // Transforma los géneros en un string
            };
        });

        return Array.isArray(transformedGamesFromDb) ? transformedGamesFromDb : [];
    } catch (error) {
        console.error(error);
        return []; // Asegúrate de devolver un array vacío en caso de error
    }
};

const getGamesByName = async (name) => {
    try {
        const gamesFromDb = await getGamesDBByName(name)
        const gamesFromApi = await getGamesAPIByName(name)
        
        return gamesFromDb.concat(gamesFromApi); 

    } catch (error) {
        console.error(error);
    }
};

const getGamesBDByGenre = async (genre) => {
    try {
        const genreFromDb = await Genres.findOne({
            where: {
                nombre: {
                    [Sequelize.Op.iLike]: `%${genre}%`,
                },
            },
        });
        let gamesFromDb = [];
        if (genreFromDb) {
            gamesFromDb = await Videogame.findAll({
                include: [
                    {
                        model: Genres,
                        where: {
                            id: genreFromDb.id,
                        },
                        attributes: ['nombre'],
                        through: {
                            attributes: [],
                        },
                    },
                ],
            });
            const transformedGamesFromDb = gamesFromDb.map(game => {
                return {
                    id: game.id,
                    nombre: game.nombre,
                    descripcion: game.descripcion,
                    plataforma: game.plataforma,
                    imagen: game.imagen,
                    rating: game.rating,
                    fecha_lanzamiento: game.fecha_lanzamiento,
                    genero: game.genres.map(genre => genre.nombre).join(', ') // Transforma los géneros en un string
                };
            });
            return Array.isArray(transformedGamesFromDb) ? transformedGamesFromDb : [];
        }
        return [];
    } catch (error) {
        console.error(error);
        return [];
    }
};

const getGamesAPIByGenre = async (genre) => {
    try {
        
        const response = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);
        const genresFromApi = response.data.results;
        const genreFromApi = genresFromApi.find(g => g.name.toLowerCase() === genre.toLowerCase());

        let gamesFromApi = [];
        if (genreFromApi) {
            const response = await axios.get(`https://api.rawg.io/api/games?genres=${genreFromApi.id}&key=${API_KEY}`);
            gamesFromApi = response.data.results.map(game => ({
                id: game.id,
                nombre: game.name,
                genero: game.genres.map(genre => genre.name).join(', '),
                descripcion: game.description,
                plataforma: game.platforms.map(platform => platform.platform.name).join(', '),
                imagen: game.background_image,
                rating: game.rating,
                fecha_lanzamiento: game.released
            }));
        }

        return Array.isArray(gamesFromApi) ? gamesFromApi : [];
       
    } catch (error) {
        console.error(error);
        return []; 
    }
};


const getGamesByGenre = async (name) => {
     try {
        const gamesFromDb = await getGamesBDByGenre(name)
        const gamesFromApi = await getGamesAPIByGenre(name)
        
        return gamesFromDb.concat(gamesFromApi); 

    } catch (error) {
        console.error(error);
    }
};



router.get("/", async (req, res) => {
    const source = req.query.source;
    const name = req.query.name;
    const genre = req.query.genre;
    let data;

    if (name) {
        if(source === "db"){
            data = await getGamesDBByName(name)
        }else if(source === "api"){
           data = await getGamesAPIByName(name)
        }else{
            data = await getGamesByName(name);
        }

    } else if (genre) {
        if(source === "db"){
            data = await getGamesBDByGenre(name)
        }else if(source === "api"){
            data = await getGamesAPIByGenre(name)
        }else{
            data = await getGamesByGenre(genre);
        } 
    } else {
        if(source === "db"){
           data = await getAllGames();
        }else if(source === "api"){
            data = await getApiInfo();
        }else{
            const gamesDb = await getAllGames();
            const gamesApi = await getApiInfo();
            data = gamesDb.concat(gamesApi);
        } 

    }

    res.status(200).send(data);
});

router.get("/id/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const game = await getGameById(id);
        if (game) {
            res.status(200).send(game);
        } else {
            res.status(400).send({ info: "no se encontro el juego" });
        }
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
      const {
        imagen,
        nombre,
        descripcion,
        plataforma,
        fecha_lanzamiento,
        rating,
        genero,
      } = req.body;
  
      // Crear nuevo juego en la base de datos
      const newGame = await Videogame.create({
        imagen,
        nombre,
        descripcion,
        plataforma,
        fecha_lanzamiento,
        rating,
      });
  
      // Obtener los géneros correspondientes desde la base de datos
      const genresDb = await Genres.findAll({
        where: { id: { [Sequelize.Op.in]: genero } },
      });
  console.log(genresDb);
      // Asociar los géneros al nuevo juego
      await newGame.addGenres(genresDb);
  
      // Enviar respuesta exitosa al cliente
      res.status(201).send({ info: "se ha creado un nuevo juego" });
    } catch (error) {
      // Manejar errores y pasar al siguiente middleware de error
      next(error);
    }
  });

module.exports = router;
