'use strict';

import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
  FlatList,
  Text,
  TextInput,
  Alert
} from 'react-native';

var Poster = require('./Poster');
var styles = require('./Styles');
var Global = require('./Global');
var Util = require('./Util');
var dismissKeyboard = require('react-native-dismiss-keyboard');

class SearchResults extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title'),
    };
  };

  constructor(props) {
    super(props);
    const {navigation} = props;
    this.listings = navigation.getParam('listings');
    this.page = navigation.getParam('page');
    this.movieId = navigation.getParam('movieId');
    this.theatreId = navigation.getParam('theatreId');
    this.movies = navigation.getParam('movies');
    this.theatres = navigation.getParam('theatres');

    this.renderRow = this.renderRow.bind(this);

    this.state = {
      selectedIndex: 0,
      movies: Object.keys(this.movies).sort((a,b) => this.movies[a].name.localeCompare(this.movies[b].name)),
      theatres: Object.keys(this.theatres).sort((a,b) => this.theatres[a].ordinal > this.theatres[b].ordinal ? 1 : -1),
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
    if (this.page < 3) {
      if (this.page == 1)  { // choosing theater
        if (id == 0) { // don't care
          movies = this.movies;
        } else {
          for (var movieId in this.theatres[id].m) { // only movies in this theater
            movies[movieId] = this.movies[movieId];
          }
        }
      } else if (this.page == 2) { // choosing first movie
        if (id == 0) { // dont care, skip to end screen
          this.goToDoubleFeatures(0,0);
          return;
        } else {
          var movieIds;
          if (this.theatreId == 0) {
            movieIds = Util.findDoubleFeatureMovieIdsInAllTheatres(id, this.theatres);
          } else {
            movieIds = Util.findDoubleFeatureMovieIdsInTheatre(this.theatreId, id, this.theatres);
          }
          for (let movieId of movieIds) {
            movies[movieId] = this.movies[movieId];
          }
        }
      }

      this.props.navigation.navigate({
        routeName: 'SearchResults',
        params: {
          title: 'Choose ' + (this.page == 2 ? 'Another' : 'Movie'),
          listings: this.listings,
          movies: movies,
          theatres: this.theatres,
          id: id,
          theatreId: (this.page == 1 ? id : this.theatreId),
          movieId: id,
          page: this.page + 1,
        },
        key: this.page + 1,
      });
    } else {
      this.goToDoubleFeatures(this.movieId, id);
    }
  }

  goToDoubleFeatures(movieId, secondMovieId) {
    var dfs;
    if (this.theatreId == 0) {
      dfs = Util.findDoubleFeaturesInAllTheatres(movieId, secondMovieId, this.theatres);
    } else {
      dfs = Util.findDoubleFeatures(this.theatreId, movieId, secondMovieId, this.theatres);
    }
    this.props.navigation.navigate({
      routeName: 'DoubleFeatures', 
      params: {
        title: 'Double Features',
        listings: this.listings,
        theatres: this.theatres,
        theatreId: this.theatreId,
        firstMovieId: this.movieId,
        secondMovieId: secondMovieId,
        dfs: dfs,
      }
    });
  }

  movieMode() {
    return this.page != 1;
  }

  renderRow({item}) {
    if (item == 0) {
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
      text = item;
      image = (<View/>);
    } else if (this.movieMode()) {
      text = this.listings.movies[item].name;
      image = (<Poster movieId={item}></Poster>);
      if (this.theatreId != 0) {
        greyedOut = Util.findDoubleFeatureMovieIdsInTheatre(this.theatreId, item, this.listings.theatres).size == 0;
      } else {
        greyedOut = Util.findDoubleFeatureMovieIdsInAllTheatres(item, this.listings.theatres).size == 0;
      }
    } else {
      text = this.listings.theatres[item].name;
      image = (<View/>);
      greyedOut = !Util.checkTheatre(item, this.listings.theatres);
    }
    return (
      <TouchableHighlight onPress={() => this.rowPressed(greyedOut ? -1 : item)}
      underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            {image}
            <View style={styles.titleContainer}>
              <Text style={greyedOut ? styles.greyedOut : styles.title} numberOfLines={this.page == 1 ? 1 : 3}>{text}</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }

  onSearchTextChanged(event) {
    var results;
    if (this.movieMode()) {
      results = Object.keys(this.movies).filter(
        id => this.movies[id].name.toLowerCase().includes(event.nativeEvent.text.toLowerCase())
      ).sort((a,b) => this.movies[a].name.localeCompare(this.movies[b].name));
      this.setState({
        movies:results,
        searchText: event.nativeEvent.text,
        movieSearchText: event.nativeEvent.text
      });
    } else {
      results = Object.keys(this.theatres).filter(
        id => this.theatres[id].name.toLowerCase().includes(event.nativeEvent.text.toLowerCase())
      ).sort((a,b) => this.theatres[a].ordinal > this.theatres[b].ordinal ? 1 : -1);
      this.setState({
        theatres: results,
        searchText: event.nativeEvent.text,
        theatreSearchText: event.nativeEvent.text
      });
    }
    this.setState({ noResults: results.length <= 1 });
  }

  renderHeader() {
    var headerText = '';
    if (this.page == 1) {
      headerText = 'Let\'s get started! First, pick a theater.';
    } else if (this.page == 2) {
      if (this.theatreId == 0) {
        headerText = 'Any theater, okay.';
      } else {
        headerText = this.listings.theatres[this.theatreId].name + ', okay.';
      }
      headerText += ' Now pick a movie!';
    } else if (this.listings.movies[this.movieId]) {
      headerText = this.listings.movies[this.movieId].name + ', nice.  You can pick another one. Or not, whatever.';
    }
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>
    );
  }

  render() {
    if (this.state.noResults) {
      dataSource = ['No results'];
    } else if (this.movieMode()) {
      var dataSource = this.state.movies;
    } else {
      var dataSource = this.state.theatres;
    }
    dataSource = [0, ...dataSource];
    console.log(dataSource);
    return (
        <View style={{flex: 1, flexDirection: 'column'}}>
          <FlatList
            data={dataSource}
            keyExtractor={(item) => `${item}`}
            renderItem={this.renderRow}
          />  
          <View style={styles.dontCareContainer}>
            <TouchableHighlight style={styles.dontCare} onPress={() => this.rowPressed(0)}>
              <Text style={[styles.title, {color: 'white'}]}>
                Any {this.page == 1 ? 'Theater' : (this.page == 3 ? 'Second ' : '') + 'Movie'}
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
