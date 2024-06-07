const {Router} = require("express");
const {Genres} = require("../db");
const axios = require("axios");
require("dotenv").config();
const {API_KEY} = process.env;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

const getAllGenres = async () => {

    const response = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}`);

    const apiGenresArray = response.data.reduce((Genres, gamesBreed) => {
        if (gamesBreed.Genres) {
            const breedGenres = gamesBreed.Genres.split(',').map((Genres) => Genres.trim());
            Genres.push(...breedGenres);
        }
        return Genres;
    }, []);


    const uniqueGenres = [...new Set(apiGenresArray)];

    for (const Genres of uniqueGenres) {
        await Genres.create({nombre: Genres});
    }

    return await Genres.findAll();
};

router.get("/", async (rq, rs) => {

    const Genres = await getAllGenres();
    rs.status(200).send(Genres);
});

module.exports = router;
