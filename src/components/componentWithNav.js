/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

'use strict';

import React, {
  Component,
} from 'react';

import ReactNative, {
  StyleSheet,
  Navigator,
  Image,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';

var _ = require('underscore')._;
var fdn = require('./foundation');
var swatches = require('./swatches');
var NavigatorNavigationBarStylesIOS = require('NavigatorNavigationBarStylesIOS');
var NavigatorNavigationBarStylesAndroid = require('NavigatorNavigationBarStylesAndroid');
var NavigatorNavigationBarStyles = (Platform.OS === 'android') ?  NavigatorNavigationBarStylesAndroid : NavigatorNavigationBarStylesIOS;

var { NavigationBar } = require('./navbar');
var EventEmitter = require('EventEmitter');


// separate the UI from the navigator + emitter
var ComponentWithNav = React.createClass({

  getInitialState: function(){
    return {
      emitter: new EventEmitter(),
    }
  },


  render: function() {
    var Component = this.props.route.component;
    var defaults = Component.routeDefaults || {};

    // if a platform is specified, and there are platform overrides, use those
    var platformDefaults;
    if( platformDefaults = Component["routeDefaults_"+this.props.platform] ){
      defaults = platformDefaults
    }

    // merge defaults
    _.defaults(this.props.route, defaults);


    return (
      <View style={[fdn.container, (this.props.route.navigationBarTransparent || this.props.route.navigationBarCustom) ? {paddingTop: 0} : {paddingTop: NavigatorNavigationBarStyles.General.TotalNavHeight}]}>
        <Component 
          route={this.props.route}
          navigator={this.props.navigator}  
          topNavigator={this.props.topNavigator}
          navigatorEmitter={this.state.emitter}
          platform={this.props.platform}
          {...this.props.route.props} 
          />
          {!this.props.route.navigationBarCustom && 
            <NavigationBar 
              title={this.props.route.name} 
              navigator={this.props.navigator}
              route={this.props.route}
              emitter={this.state.emitter}
              belongsToNavigator={this.props.belongsToNavigator}
              isTransparent={this.props.route.navigationBarTransparent}
              /> 
          }
        </View>

    );
  }
});



module.exports = ComponentWithNav;