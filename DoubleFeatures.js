'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  SectionList,
  Linking,
  Dimensions,
} from 'react-native';

var Util = require('./Util');
var styles = require('./Styles');
var Poster = require('./Poster');

class DoubleFeatures extends Component {
  static navigationOptions = {
    title: 'Double Features',
  };

  constructor(props) {
    super(props);
    const {navigation} = props;
    this.movies = navigation.getParam('movies');
    this.theatres = navigation.getParam('theatres');
    this.listings = navigation.getParam('listings');
    this.page = navigation.getParam('page');
    this.movieId = navigation.getParam('movieId');
    this.theatreId = navigation.getParam('theatreId');
    this.dfs = navigation.getParam('dfs');

    this.data = []; // [{data: [[theatreId, movieId1, time1, movieId2, time2]], key: theatreId}]
    var sections = []; // [theatreId]
    this.dfs.map((df) => {
      var section = df[0];
      if (sections.indexOf(section) === -1) { // if there's no section yet, make one
        sections.push(section);
        this.data.push({data: [], key: section});
      }
      this.data.forEach((theatre) => { // now find the right section, maybe the one we just put in, and stick it in
        if (theatre.key === df[0]) { 
          // dups get in somehow, and this fixes it
          if (theatre.data.find((eDf) => { return eDf[1] === df[1] && eDf[2] === df[2] && eDf[3] === df[3] && eDf[4] === df[4]}) == null) {
            theatre.data.push(df);
          }
        }
      });
    });

    this.data.sort((a, b) => this.theatres[a.key].ordinal > this.theatres[b.key].ordinal ? 1 : -1);

    this.data.forEach(theatre => {
      theatre.data.sort((a,b) => parseInt(a[2]) > parseInt(b[2]) ? 1 : -1);
    });

    var dimensions = Dimensions.get('window');
    var small = (dimensions.width < 350);
    this.state = {
      small: small,
      imageHeight: small ? 140 : 180
    }
  }

  rowPressed(link) {
    if (link != '') {
      Linking.openURL(link);
    }
  }


  renderRow({item}) {
    const sectionId = item[0];
    const rowData = item;
    var firstLink = this.listings.theatres[sectionId]['m'][rowData[1]][rowData[2]]['l'];
    var secondLink = this.listings.theatres[sectionId]['m'][rowData[3]][rowData[4]]['l'];
    var timeStyle = (this.state.small ? styles.timeSmall : styles.time);
    return (
      <View style={{flexDirection:'row'}}>
        <View style={{flex: 1, padding:5, height: this.state.imageHeight}}>
          <Poster movieId={rowData[3]} small={this.state.small} style={{position:'absolute', top: 35, left: 35}} />
          <Poster movieId={rowData[1]} small={this.state.small} style={{position:'absolute', top: 5, left: 5}} />
        </View>
        <View style={{flex: 2, flexDirection: 'row', height:this.state.imageHeight, alignItems:'center'}}>
          <View style={{flex: 1, padding: 5, marginTop:25, marginLeft:5}}>
            <TouchableHighlight style={{height: (this.state.imageHeight/2), flex:1}} onPress={() => this.rowPressed(firstLink)} underlayColor='white'>
              <View>
                <Text style={[timeStyle, {fontWeight:'bold'}, (firstLink != '' ? styles.hasLink:{})]}>
                  {Util.minsToTime(parseInt(rowData[2]))}
                </Text>
                <Text style={[timeStyle, {fontSize: 10, textAlign:'center'}]}>to</Text>
                <Text style={timeStyle}>{Util.minsToTime(parseInt(rowData[2]) + parseInt(this.listings.movies[rowData[1]].duration))}</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight style={{height: (this.state.imageHeight/2), flex:1}} onPress={() => this.rowPressed(secondLink)} underlayColor='white'>
              <View>
                <Text style={[timeStyle, {fontWeight:'bold'}, (firstLink != '' ?styles.hasLink:{})]}>
                  {Util.minsToTime(parseInt(rowData[4]))}
                </Text>
                <Text style={[timeStyle, {fontSize: 10, textAlign:'center'}]}>to</Text>
                <Text style={timeStyle}>{Util.minsToTime(parseInt(rowData[4]) + parseInt(this.listings.movies[rowData[3]].duration))}</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{flex: 2, flexDirection: 'column',padding: 5, marginTop:20}}>
            <TouchableHighlight style={{height:(this.state.imageHeight/2)}} onPress={() => this.rowPressed(firstLink)} underlayColor='white'>
              <Text style={[styles.dfResultText, {}]} numberOfLines={3}>{this.listings.movies[rowData[1]]['name']}</Text>
            </TouchableHighlight>
            <TouchableHighlight style={{height:(this.state.imageHeight/2)}} onPress={() => this.rowPressed(secondLink)}  underlayColor='white'>
              <Text style={[styles.dfResultText, {}]} numberOfLines={3}>{this.listings.movies[rowData[3]]['name']}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Here are your double features. Enjoy your day at the movies!</Text>
      </View>
    );
  }

  renderSectionHeader({section}) {
    return (
      <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{this.listings.theatres[section.key]['name']}</Text>
      </View>
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View style={styles.separator} ></View>
    );
  }

  render() {
    return (
      <>
        {this.renderHeader()}
        <SectionList
          keyExtractor={(item) => {
            return `${item[0]}-${item[1]}-${item[2]}-${item[3]}-${item[4]}`;
          }}
          renderItem={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          sections={this.data}
        />
      </>        
    );
  }
}

module.exports = DoubleFeatures;
