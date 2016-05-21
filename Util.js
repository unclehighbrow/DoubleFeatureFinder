'use strict';

var React = require('react-native');
var {
  Text,
  NavigatorIOS,
  AppRegistry
} = React;

var Util = React.createClass({
  statics: {
    minsToTime: function(mins) {
      mins = mins % 1440;
      var meridian = 'AM';
      if (mins >= 720) {
        meridian = 'PM';
        mins -= 720;
      }
      var minutes = '' + (mins % 60);
      if (minutes.length == 1) {
        minutes = '0' + minutes;
      }
      var hours = Math.floor(mins / 60);
      if (hours == 0) {
        hours = 12;
      }
      return '' + hours + ':' + minutes + ' ' + meridian;
    },
    checkTheatre(theatreId, theatres) {
      for (var movieId in theatres[theatreId]['m']) {
        if (Util.findDoubleFeatureMovieIdsInTheatre(theatreId, movieId, theatres).size > 0) {
          return true;
        }
      }
      return false;
    },
    findDoubleFeatureMovieIdsInTheatre(theatreId, movieId, theatres) {
      var ret = new Set();
      var dffs = Util.findDoubleFeatures(theatreId, movieId, 0, theatres);
      for (let dff of dffs) {
        ret.add(dff[1]);
        ret.add(dff[3]);
      }
      ret.delete(movieId);
      return ret;
    },
    findDoubleFeatureMovieIdsInAllTheatres(movieId, theatres) {
      var ret = new Set();
      for (var theatreId in theatres) {
        var theatreSet = Util.findDoubleFeatureMovieIdsInTheatre(theatreId, movieId, theatres);
        for (let movieId of theatreSet) {
          ret.add(movieId);
        }
      }
      return ret;
    },
    findDoubleFeatures(theatreId, movieId, secondMovieId, theatres) {
      var ret = [];
      var theatre = theatres[theatreId];
      for (var iMovieId in theatre['m']) {
        if (movieId == 0 || iMovieId == movieId) {
          for (var showtime in theatre['m'][iMovieId]) {
            if (theatre['m'][iMovieId][showtime]['b']) {
              for (let df of theatre['m'][iMovieId][showtime]['b']) {
                if (secondMovieId == 0 || df[0] == secondMovieId) {
                  ret.push([theatreId, df[0], df[1], iMovieId, showtime]);
                }
              }
            }
            if (theatre['m'][iMovieId][showtime]['a']) {
              for (let df of theatre['m'][iMovieId][showtime]['a']) {
                if (secondMovieId == 0 || df[0] == secondMovieId) {
                  ret.push([theatreId, iMovieId, showtime, df[0], df[1]]);
                }
              }
            }
          }
        }
      }
      return ret;
    },
    findDoubleFeaturesInAllTheatres(movieId, secondMovieId, theatres) {
      var ret =[];
      for (var theatreId in theatres) {
        var theatreDffs = Util.findDoubleFeatures(theatreId, movieId, secondMovieId, theatres);
        for (let movieId of theatreDffs) {
          ret.push(movieId);
        }
      }
      return ret;
    }
  },
  render() {},
});

module.exports = Util;
