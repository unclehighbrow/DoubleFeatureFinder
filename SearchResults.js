'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
  Text,
  SegmentedControlIOS,
  ScrollView,
  TextInput,
  Platform,
  Dimensions,
  Alert
} from 'react-native';

var Poster = require('./Poster');
var styles = require('./Styles');
var Global = require('./Global');
var DoubleFeatures = require('./DoubleFeatures');
var Util = require('./Util');
var dismissKeyboard = require('react-native-dismiss-keyboard');

class SearchResults extends Component {
  constructor(props) {
    super(props);
    var movieDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid
    }).cloneWithRows([''].concat(Object.keys(this.props.movies).sort((a,b) => this.props.movies[a].name.localeCompare(this.props.movies[b].name))));
    var theatreDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid
    }).cloneWithRows([''].concat(Object.keys(this.props.theatres).sort((a,b) => this.props.theatres[a].ordinal > this.props.theatres[b].ordinal ? 1 : -1)));
    this.state = {
      selectedIndex: 0,
      movieDataSource: movieDataSource,
      theatreDataSource: theatreDataSource,
      movieSearchText: '',
      theatreSearchText: '',
      searchText: '',
      noResults: false
    };
    Global.manual = true;
  }

  rowPressed(id) {
    dismissKeyboard();
    if (id == -1) {
      return this.alert();
    }
    var movies = {};
    if (this.props.page < 3) {
      if (this.props.page == 1)  { // choosing theater
        if (id == 0) { // don't care
          movies = this.props.movies;
        } else {
          for (var movieId in this.props.theatres[id].m) { // only movies in this theater
            movies[movieId] = this.props.movies[movieId];
          }
        }
      } else if (this.props.page == 2) { // choosing first movie
        if (id == 0) { // dont care, skip to end screen
          this.goToDoubleFeatures(0,0);
          return;
        } else {
          var movieIds;
          if (this.props.theatreId == 0) {
            movieIds = Util.findDoubleFeatureMovieIdsInAllTheatres(id, this.props.theatres);
          } else {
            movieIds = Util.findDoubleFeatureMovieIdsInTheatre(this.props.theatreId, id, this.props.theatres);
          }
          for (let movieId of movieIds) {
            movies[movieId] = this.props.movies[movieId];
          }
        }
      }
      this.props.navigator.push({
        id: 'SearchResults',
        title: 'Choose ' + (this.props.page == 2 ? 'Another' : 'Movie'),
        component: SearchResults,
        passProps: {
          listings: this.props.listings,
          movies: movies,
          theatres: this.props.theatres,
          id: id,
          theatreId: (this.props.page == 1 ? id : this.props.theatreId),
          movieId: id,
          page: this.props.page + 1,
        }
      });
    } else {
      this.goToDoubleFeatures(this.props.movieId, id);
    }
  }

  goToDoubleFeatures(movieId, secondMovieId) {
    var dfs;
    if (this.props.theatreId == 0) {
      dfs = Util.findDoubleFeaturesInAllTheatres(movieId, secondMovieId, this.props.theatres);
    } else {
      dfs = Util.findDoubleFeatures(this.props.theatreId, movieId, secondMovieId, this.props.theatres);
    }
    this.props.navigator.push({
      id: 'DoubleFeatures',
      title: 'Double Features',
      component: DoubleFeatures,
      passProps: {
        listings: this.props.listings,
        theatres: this.props.theatres,
        theatreId: this.props.theatreId,
        firstMovieId: this.props.movieId,
        secondMovieId: secondMovieId,
        dfs: dfs,
      }
    });
  }

  movieMode() {
    return this.props.page != 1;
  }

  renderRow(rowData, sectionId, rowId) {
    if (rowId == 0) {
      var placeholder = this.movieMode() ? 'Search Movies' : 'Search Theaters';
      return (
        <TextInput
          style={styles.searchInput}
          onChange={this.onSearchTextChanged.bind(this)}
          placeholder={placeholder}
          placeholderTextColor={'#999'}
          autoCorrect={false}
          clearButtonMode='while-editing'
          autoCapitalize='none'
          value={this.state.searchText}
        />
      );
    }
    var text, image;
    var greyedOut = false;
    if (this.state.noResults) {
      text = rowData;
      image = (<View/>);
    } else if (this.movieMode()) {
      text = this.props.listings.movies[rowData].name;
      image = (<Poster movieId={rowData}></Poster>);
      if (this.props.theatreId != 0) {
        greyedOut = Util.findDoubleFeatureMovieIdsInTheatre(this.props.theatreId, rowData, this.props.listings.theatres).size == 0;
      } else {
        greyedOut = Util.findDoubleFeatureMovieIdsInAllTheatres(rowData, this.props.listings.theatres).size == 0;
      }
    } else {
      text = this.props.listings.theatres[rowData].name;
      image = (<View/>);
      greyedOut = !Util.checkTheatre(rowData, this.props.listings.theatres);
    }
    return (
      <TouchableHighlight onPress={() => this.rowPressed(greyedOut ? -1 : rowData)}
      underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            {image}
            <View style={styles.titleContainer}>
              <Text style={greyedOut ? styles.greyedOut : styles.title} numberOfLines={this.props.page == 1 ? 1 : 3}>{text}</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }

  onSearchTextChanged(event) {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid
    });
    var results;
    if (this.movieMode()) {
      results = [''].concat(Object.keys(this.props.movies).filter(
        id => this.props.movies[id].name.toLowerCase().includes(event.nativeEvent.text.toLowerCase())
      ).sort((a,b) => this.props.movies[a].name.localeCompare(this.props.movies[b].name)));
      this.setState({
        movieDataSource: dataSource.cloneWithRows(results),
        searchText: event.nativeEvent.text,
        movieSearchText: event.nativeEvent.text
      });
    } else {
      results = [''].concat(Object.keys(this.props.theatres).filter(
        id => this.props.theatres[id].name.toLowerCase().includes(event.nativeEvent.text.toLowerCase())
      ).sort((a,b) => this.props.theatres[a].ordinal > this.props.theatres[b].ordinal ? 1 : -1));
      this.setState({
        theatreDataSource: dataSource.cloneWithRows(results),
        searchText: event.nativeEvent.text,
        theatreSearchText: event.nativeEvent.text
      });
    }
    this.setState({ noResults: results.length <= 1 });
  }

  renderHeader() {
    var headerText = '';
    if (this.props.page == 1) {
      headerText = 'Let\'s get started! First, pick a theater.';
    } else if (this.props.page == 2) {
      if (this.props.theatreId == 0) {
        headerText = 'Any theater, okay.';
      } else {
        headerText = this.props.listings.theatres[this.props.theatreId].name + ', okay.';
      }
      headerText += ' Now pick a movie!';
    } else if (this.props.listings.movies[this.props.movieId]) {
      headerText = this.props.listings.movies[this.props.movieId].name + ', nice.  You can pick another one. Or not, whatever.';
    }
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>
    );
  }

  render() {
    if (this.state.noResults) {
      var dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.guid !== r2.guid }).cloneWithRows(['', 'No results']);
    } else if (this.movieMode()) {
      var dataSource = this.state.movieDataSource;
    } else {
      var dataSource = this.state.theatreDataSource;
    }
    return (
        <View style={{flex: 1, flexDirection: 'column'}}>
          <ListView
            dataSource={dataSource}
            keyboardShouldPersistTaps={true}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections={true}
            renderHeader={this.renderHeader.bind(this)}
          />
          <View style={styles.dontCareContainer}>
            <TouchableHighlight style={styles.dontCare} onPress={() => this.rowPressed(0)}>
              <Text style={[styles.title, {color: 'white'}]}>
                Any {this.props.page == 1 ? 'Theater' : (this.props.page == 3 ? 'Second ' : '') + 'Movie'}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
    );
  }

  alert() {
    Alert.alert("Try another one", "Some smaller theaters don't have enough screens to make a double feature happen. Them's the breaks.");
  }
}

module.exports = SearchResults;
