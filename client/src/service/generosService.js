export function getGenres() {
    return async function (dispatch) {
      var json = await axios.get("http://localhost:3001/genres/");
      return dispatch({
        type: "GET_GENRES",
        payload: json.data,
      });
    };
  }