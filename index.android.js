'use strict';

var React = require('react-native');
var {
  Text,
  Navigator,
  AppRegistry,
  View,
  TouchableOpacity,
  StyleSheet
} = React;
var SearchPage = require('./SearchPage');
var SearchResults = require('./SearchResults');
var Showtimes = require('./Showtimes');
var DoubleFeatures = require('./DoubleFeatures');
var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Back
        </Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    return (
      <View />
    );
  },

  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },

};


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
          name=''
        />
      );
    }
  }

  render() {
    return (
      <Navigator
        style={styles.container}
        initialRoute={{name: '', index: 0}}
        renderScene={this.renderScene}
        navigationBar={<Navigator.NavigationBar routeMapper={ NavigationBarRouteMapper } />}
      />
    );
  }
}

var styles = React.StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40
  },
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginTop: 50,
    marginLeft: 15,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: '#373E4D',
    fontWeight: '500'
  },
  navBarLeftButton: {
    paddingLeft: 10,
    flex: 0
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#5890FF',
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
});

AppRegistry.registerComponent('DoubleFeatureFinder', () => DoubleFeatureFinder);
