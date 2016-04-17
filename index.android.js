'use strict';

var React = require('react-native');
var {
  Text,
  Navigator,
  AppRegistry
} = React;
var SearchPage = require('./SearchPage');
var SearchResults = require('./SearchResults');
var Showtimes = require('./Showtimes');
var DoubleFeatures = require('./DoubleFeatures');


class DoubleFeatureFinder extends React.Component {
  renderScene(route, navigator) {
    switch (route.id) {
      case 'DoubleFeatures': return (
        <DoubleFeatures
          navigator={navigator}
          showtime={route.passProps.showtime}
          listings={route.passProps.listings}
          movieId={route.passProps.movieId}
          theatreId={route.passProps.theatreId}
        />
      );
      case 'Showtimes': return (
        <Showtimes
          navigator={navigator}
          showtimes={route.passProps.showtimes}
          listings={route.passProps.listings}
          movieId={route.passProps.movieId}
          theatreId={route.passProps.theatreId}
        />
      );
      case 'SearchResults': return (
        <SearchResults
          navigator={navigator}
          listings={route.passProps.listings}
          movies={route.passProps.movies}
          theatres={route.passProps.theatres}
          id={route.passProps.id}
          movieMode={route.passProps.movieMode}
        />
      );
      default: return (
        <SearchPage
          navigator={navigator}
          name='Enter Zip'
        />
      );
    }
  }

  render() {
    return (
      <Navigator
        style={styles.container}
        initialRoute={{name: 'Enter Zip', index: 0}}
        renderScene={this.renderScene}
      />
    );
  }
}

var styles = React.StyleSheet.create({
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('DoubleFeatureFinder', () => DoubleFeatureFinder);
