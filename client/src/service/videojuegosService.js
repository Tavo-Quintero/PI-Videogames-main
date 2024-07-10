import axios from "axios";

export function getVideoGames() {
  return async function (dispatch) {
    var json = await axios.get("http://localhost:3001/videogames/");
    return dispatch({
      type: "GET_VIDEOGAMES",
      payload: json.data,
    });
  };
}

export function VideoGamesDetail(id) {
  return async function (dispatch) {
    var json = await axios.get("http://localhost:3001/videogames/id" + id);
    return dispatch({
      type: "VIDEOGAMES_DETAIL",
      payload: json.data,
    });
  };
}

export function postVideoGames(payload) {
  return async function (dispatch) {
    var json = await axios.post("http://localhost:3001/videogames/", payload); 
    return dispatch({
      type: "POST_VIDEOGAMES",
      payload: json.data,
    });
  };
}
