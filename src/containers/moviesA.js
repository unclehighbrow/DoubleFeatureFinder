'use strict';

import { connect } from 'react-redux'
import { selectMovieA } from '../actions'

import Movies from '../components/movies';
import MoviesB from './moviesB';
import DoubleFeatures from './doubleFeatures';

import Util from '../components/util';

const mapStateToProps = state => {
  return {
    theaters: state.doubleFeatures.theaters,
    movies: state.doubleFeatures.movies,
    city: state.doubleFeatures.city,
    selectedTheaterId: state.doubleFeatures.selectedTheaterId,
    selectedTheater: state.doubleFeatures.theaters[state.doubleFeatures.selectedTheaterId],
    availableMovieIds: Object.keys(state.doubleFeatures.theaters[state.doubleFeatures.selectedTheaterId].m),
    nextScene: MoviesB,
    isLoading: state.doubleFeatures.isLoading
  }
}

const mapDispatchToProps = {
  selectMovie: selectMovieA,
}

const moviesContainer = connect(mapStateToProps, mapDispatchToProps)(Movies);
export default moviesContainer;