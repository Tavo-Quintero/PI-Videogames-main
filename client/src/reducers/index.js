import { combineReducers } from 'redux';
import navegadorReducer from './navegadorReducer';
import navigationReducer from './navegationReducer';

const rootReducer = combineReducers({
  navegador: navegadorReducer,
  navigation: navigationReducer,
  // otros reducers...
});

export default rootReducer;
