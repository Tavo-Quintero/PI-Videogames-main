import axios from 'axios';

export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_SORT_BY = 'SET_SORT_BY';
export const SET_SORT_ORDER = 'SET_SORT_ORDER';
export const FETCH_VIDEO_GAMES_SUCCESS = 'FETCH_VIDEO_GAMES_SUCCESS';
export const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
export const UPDATE_FORM_ERROR = 'UPDATE_FORM_ERROR';
export const UPDATE_FORM_DATA = 'UPDATE_FORM_DATA';
export const SET_FILTER_BY_GENRE = 'SET_FILTER_BY_GENRE';
export const SET_FILTER_BY_SOURCE = 'SET_FILTER_BY_SOURCE';

// Creadores de acciones
export const setFilterByGenre = (genre) => ({
  type: SET_FILTER_BY_GENRE,
  payload: genre,
});

export const setFilterBySource = (source) => ({
  type: SET_FILTER_BY_SOURCE,
  payload: source,
});

export const updateFormError = (fieldName, isError) => ({
  type: "UPDATE_FORM_ERROR",
  payload: { fieldName, isError },
});

export const updateFormData = (fieldName, value) => ({
  type: "UPDATE_FORM_DATA",
  payload: { fieldName, value },
});
// Acción para establecer la página actual
export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

// Acción para establecer el criterio de ordenamiento
export const setSortBy = (sortBy) => ({
  type: SET_SORT_BY,
  payload: sortBy,
});

// Acción para establecer el orden de ordenamiento
export const setSortOrder = (sortOrder) => ({
  type: SET_SORT_ORDER,
  payload: sortOrder,
});

// Acción asíncrona para obtener los videojuegos y despachar FETCH_VIDEO_GAMES_SUCCESS
export const fetchVideoGames = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get("http://localhost:3001/videogames/");
      dispatch({
        type: FETCH_VIDEO_GAMES_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
};

// Acción para establecer los resultados de la búsqueda
export const setSearchResults = (results) => ({
  type: SET_SEARCH_RESULTS,
  payload: results,
});


// Acción para ir a la página de inicio (ejemplo)
export const GO_TO_HOME = 'GO_TO_HOME';

export const goToHome = () => ({
  type: GO_TO_HOME
});
