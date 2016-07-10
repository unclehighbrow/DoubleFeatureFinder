import { combineReducers } from "redux";
import * as types from "../actions";

const doubleFeatures = (state = {
  lat: 0,
  lon: 0,
  country: '',
  city: '',
  zip: '',
  theaters: {},
  movies: {},
  date: 0,
}, action) => {
  switch (action.type) {
    case types.RECEIVE_LOCATION:
      return { ...state, 
        zip: action.zip,
        country: action.country,
        city: action.city,
        lat: action.lat,
        lon: action.lon
      };
    case types.RECEIVE_DOUBLE_FEATURES:
      return { ...state, 
        theaters: action.theaters,
        movies: action.movies,
        date: action.date
      };  
    default:
      return state;
  }
};


const rootReducer = combineReducers({
  doubleFeatures,
  //whatever,
});

export default rootReducer;