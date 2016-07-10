/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, {
  Component,
} from 'react';

import ReactNative, {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Search from '../containers/search';
import ContextNavigator from './contextNavigator';

class App extends Component {
  render() {
    return (
      <ContextNavigator
        route={{
          initialRoute: {
              component: Search
          }
        }}
        />
    );
  }
}

export default App;

