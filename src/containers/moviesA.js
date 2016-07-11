'use strict';

import { connect } from 'react-redux'
import { selectMovieA } from '../actions'

import Movies from '../components/movies';

const mapStateToProps = state => {
  var availableMovieIds = [];

  return {
    theaters: state.doubleFeatures.theaters,
    movies: state.doubleFeatures.movies,
    city: state.doubleFeatures.city,
    selectedTheater: state.doubleFeatures.selectedTheater,
    availableMovieIds
  }
}

/*
movieA, movieB progression
double feature screen
"don't care" option
force location picking when none available
location modal action
loading indicator for theaters screen
*/

const mapDispatchToProps = {
  selectMovieA,
}

const moviesContainer = connect(mapStateToProps, mapDispatchToProps)(Movies);
export default moviesContainer;