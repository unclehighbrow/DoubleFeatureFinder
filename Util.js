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
      var meridian = 'AM';
      if (mins > 720) {
        meridian = 'PM';
        mins -= 720;
      }
      var minutes = '' + (mins % 60);
      if (minutes.length == 1) {
        minutes += '0';
      }
      var hours = Math.floor(mins / 60);
      if (hours == 0) {
        hours = 12;
      }
      return '' + hours + ':' + minutes + ' ' + meridian;
    },
  },
  render() {}
});

module.exports = Util;
