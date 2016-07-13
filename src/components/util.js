'use strict';

import React, {
  Component,
} from 'react';

import {
  Text,
  NavigatorIOS,
  AppRegistry
} from 'react-native';

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

    findDoubleFeatureMovieIds(theatreId, movieId, theatres) {
      var ret = new Set();
      var availableTheatres = (theatreId) ? {[theatreId]: theatres[theatreId]} : theatres;
      for (var availableTheatreId in availableTheatres) {
        var dffs = Util.findDoubleFeatures(availableTheatreId, movieId, 0, theatres);
        for (let dff of dffs) {
          ret.add(dff[1]);
          ret.add(dff[3]);
        }
        ret.delete(movieId);
      }
      return Array.from(ret);
    },

    findDoubleFeatures(theatreId, movieId, secondMovieId, theatres) {
      var ret = [];
      var availableTheatres = (theatreId) ? {[theatreId]: theatres[theatreId]} : theatres;
      for (var availableTheatreId in availableTheatres) {
        var theatre = availableTheatres[availableTheatreId];
        for (var iMovieId in theatre['m']) {
          if (movieId == 0 || iMovieId == movieId) {
            for (var showtime in theatre['m'][iMovieId]) {
              if (theatre['m'][iMovieId][showtime]['b']) {
                for (let df of theatre['m'][iMovieId][showtime]['b']) {
                  if (secondMovieId == 0 || df[0] == secondMovieId) {
                    ret.push([availableTheatreId, df[0], df[1], iMovieId, showtime]);
                  }
                }
              }
              if (theatre['m'][iMovieId][showtime]['a']) {
                for (let df of theatre['m'][iMovieId][showtime]['a']) {
                  if (secondMovieId == 0 || df[0] == secondMovieId) {
                    ret.push([availableTheatreId, iMovieId, showtime, df[0], df[1]]);
                  }
                }
              }
            }
          }
        }
      }
      return ret;
    },


  },
  render() {},
});

module.exports = Util;
