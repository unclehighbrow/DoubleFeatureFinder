/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {createStackNavigator, createAppContainer} from 'react-navigation';

var SearchPage = require('./SearchPage');
var SearchResults = require('./SearchResults');
var DoubleFeatures = require('./DoubleFeatures');

const MainNavigator = createStackNavigator({
  SearchPage: {screen: SearchPage},
  SearchResults: {screen: SearchResults},
  DoubleFeatures: {screen: DoubleFeatures},
});

const App = createAppContainer(MainNavigator);

export default App;