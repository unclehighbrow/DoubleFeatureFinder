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
  selectedTheaterId: null,
  selectedMovieAId: null,
  selectedMovieBId: null
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
    case types.REQUEST_DOUBLE_FEATURES:
    case types.RECEIVE_DOUBLE_FEATURES:
      return { ...state, 
        theaters: action.theaters,
        movies: action.movies,
        date: action.date,
        selectedTheaterId: action.selectedTheaterId,
        selectedMovieAId: action.selectedMovieAId,
        selectedMovieBId: action.selectedMovieBId,
      };
    case types.SELECT_THEATER:  
      return { ...state, 
          selectedTheaterId: action.selectedTheaterId,
          selectedMovieAId: action.selectedMovieAId,
          selectedMovieBId: action.selectedMovieBId,
      }
    case types.SELECT_MOVIE_A:  
      return { ...state, 
          selectedMovieAId: action.selectedMovieAId,
          selectedMovieBId: action.selectedMovieBId,
      }  
    case types.SELECT_MOVIE_B:  
      return { ...state, 
          selectedMovieBId: action.selectedMovieBId,
      } 
    default:
      return state;
  }
};


const rootReducer = combineReducers({
  doubleFeatures,
  //whatever,
});

export default rootReducer;