'use strict';

var React = require('react-native');
var {
  Text,
  NavigatorIOS,
  AppRegistry
} = React;
var SearchPage = require('./SearchPage');


class DoubleFeatureFinder extends React.Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Double Feature Finder',
          component: SearchPage,
        }}/>
    );
  }
}

var styles = React.StyleSheet.create({
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('DoubleFeatureFinder', () => DoubleFeatureFinder);
