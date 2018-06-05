'use strict';

import React, { Component } from 'react';
import {
  Text,
  NavigatorIOS,
  AppRegistry,
  View,
  TouchableOpacity,
  StyleSheet,
  BackAndroid,
  Image,
  Platform,
} from 'react-native';
import {
  Navigator,
} from 'react-native-deprecated-custom-components';

var SearchPage = require('./SearchPage');
var SearchResults = require('./SearchResults');
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
        <Image source={require('./arrow.png')} resizeMode={'contain'} />
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
      <Text style={styles.navBarTitleText}>
        {route.title}
      </Text>
    );
  },
};

var navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
    if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
    }
    return false;
});


class DoubleFeatureFinder extends React.Component {
  renderScene(route, navigator) {
    switch (route.id) {
      case 'DoubleFeatures': return (
        <DoubleFeatures
          navigator={navigator}
          showtime={route.passProps.showtime}
          listings={route.passProps.listings}
          theatreId={route.passProps.theatreId}
          firstMovieId={route.passProps.firstMovieId}
          secondMovieId={route.passProps.secondMovieId}
          theatres={route.passProps.theatres}
          dfs={route.passProps.dfs}
        />
      );
      case 'SearchResults': return (
        <SearchResults
          navigator={navigator}
          listings={route.passProps.listings}
          movies={route.passProps.movies}
          theatres={route.passProps.theatres}
          id={route.passProps.id}
          theatreId={route.passProps.theatreId}
          movieId={route.passProps.movieId}
          page={route.passProps.page}
        />
      );
      default: return (
        <SearchPage
          navigator={navigator}
          name='Search'
        />
      );
    }
  }


  render() {
    if (Platform.OS === 'ios') {
      return (
        <NavigatorIOS
          style={styles.iosContainer}
          initialRoute={{
            title: 'Search',
            component: SearchPage,
          }}/>
      );
    } else {
      return (
        <Navigator
          ref={(nav) => { navigator = nav; }}
          style={[styles.container, {backgroundColor:'white'}]}
          initialRoute={{name: '', index: 0}}
          renderScene={this.renderScene}
          navigationBar={<Navigator.NavigationBar style={{backgroundColor: 'dodgerblue'}} routeMapper={ NavigationBarRouteMapper } />}
          configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottomAndroid}
        />
      );
    }
  }
}

var styles = StyleSheet.create({
  iosContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#EAEAEA',
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
  navBarTitleText: {
    color: 'white',
    fontWeight: '500',
    marginTop: 18
  },
  navBarLeftButton: {
    paddingLeft: 10,
    marginTop: 15
  },
});

AppRegistry.registerComponent('DoubleFeatureFinder', () => DoubleFeatureFinder);
