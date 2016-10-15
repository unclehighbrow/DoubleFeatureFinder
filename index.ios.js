'use strict';

import React, { Component } from 'react';
import {
  Text,
  NavigatorIOS,
  AppRegistry,
  StyleSheet
} from 'react-native';

var SearchPage = require('./SearchPage');


class DoubleFeatureFinder extends React.Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Search',
          component: SearchPage,
        }}/>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('DoubleFeatureFinder', () => DoubleFeatureFinder);
