import { GO_TO_HOME } from '../actions/navegadorAction';

const initialState = {
  currentPage: 'landing'
};

const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GO_TO_HOME:
      return {
        ...state,
        currentPage: 'home'
      };
    default:
      return state;
  }
};

export default navigationReducer;
