'use strict';

import { connect } from 'react-redux'
import { selectMovieB } from '../actions'

import Movies from '../components/movies';
import DoubleFeatures from './doubleFeatures';

import Util from '../components/util';

const mapStateToProps = state => {


  var availableMovieIds = Util.findDoubleFeatureMovieIds(state.doubleFeatures.selectedTheaterId, state.doubleFeatures.selectedMovieAId, state.doubleFeatures.theaters);

  return {
    theaters: state.doubleFeatures.theaters,
    movies: state.doubleFeatures.movies,
    city: state.doubleFeatures.city,
    selectedTheaterId: state.doubleFeatures.selectedTheaterId,
    selectedTheater: state.doubleFeatures.theaters[state.doubleFeatures.selectedTheaterId],
    availableMovieIds,
    nextScene: DoubleFeatures,
  }
}

const mapDispatchToProps = {
  selectMovie: selectMovieB
}

const moviesContainer = connect(mapStateToProps, mapDispatchToProps)(Movies);
export default moviesContainer;