// reducers/navegadorReducer.js

import {
    SET_CURRENT_PAGE,
    SET_SORT_BY,
    SET_SORT_ORDER,
    FETCH_VIDEO_GAMES_SUCCESS,
    SET_SEARCH_RESULTS,
    UPDATE_FORM_ERROR,
    UPDATE_FORM_DATA,
    SET_FILTER_BY_GENRE,
    SET_FILTER_BY_SOURCE,
  } from '../actions/navegadorAction';
  
  const initialState = {
    videoGames: [],
    currentPage: 1,
    sortBy: 'name',
    sortOrder: 'asc',
    searchResults: [],
    formData: {
      nombre: '',
      imagen: '',
      descripcion: '',
      plataformas: '',
      fechaLanzamiento: '',
      rating: '',
      genero: '',
    },
    formErrors: {
      nombreError: false,
      imagenError: false,
      descripcionError: false,
      plataformasError: false,
      ratingError: false,
    },
    filterByGenre: null,
    filterBySource: 'all', // 'all', 'db', 'api'
  };
  
  const navegadorReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_CURRENT_PAGE:
        return {
          ...state,
          currentPage: action.payload,
        };
      case SET_SORT_BY:
        return {
          ...state,
          sortBy: action.payload,
        };
      case SET_SORT_ORDER:
        return {
          ...state,
          sortOrder: action.payload,
        };
      case FETCH_VIDEO_GAMES_SUCCESS:
        return {
          ...state,
          videoGames: action.payload,
        };
      case SET_SEARCH_RESULTS:
        return {
          ...state,
          searchResults: action.payload,
        };
      case UPDATE_FORM_ERROR:
        return {
          ...state,
          formErrors: {
            ...state.formErrors,
            [action.payload.fieldName]: action.payload.isError,
          },
        };
      case UPDATE_FORM_DATA:
        return {
          ...state,
          formData: {
            ...state.formData,
            [action.payload.fieldName]: action.payload.value,
          },
        };
        case SET_FILTER_BY_GENRE:
      return {
        ...state,
        filterByGenre: action.payload,
      };

    case SET_FILTER_BY_SOURCE:
      return {
        ...state,
        filterBySource: action.payload,
      };
      default:
        return state;
    }
  };
  
  export default navegadorReducer;
  