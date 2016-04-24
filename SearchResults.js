'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  ListView,
  Text,
  Component,
  SegmentedControlIOS,
  ScrollView,
  TextInput,
  Platform,
  Dimensions
} = React;
var Poster = require('./Poster');
var Showtimes = require('./Showtimes');
var styles = require('./Styles');
var Global = require('./Global');
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var ScrollableTabView = require('react-native-scrollable-tab-view');

class SearchResults extends Component {
  constructor(props) {
    super(props);
    var movieDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid
    }).cloneWithRows([''].concat(Object.keys(this.props.movies).sort((a,b) => this.props.movies[a].name.localeCompare(this.props.movies[b].name))));
    var theatreDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid
    }).cloneWithRows([''].concat(Object.keys(this.props.theatres).sort((a,b) => this.props.theatres[a].name.localeCompare(this.props.theatres[b].name))));
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
    if (this.props.id) {
      var showtimes, movieId, theatreId;
      if (!this.movieMode()) { // TODO: this seems like it should be opposite, but who am I to judge
        showtimes = this.props.listings.theatres[id].m[this.props.id];
        theatreId = id;
        movieId = this.props.id;
      } else {
        showtimes = this.props.listings.theatres[this.props.id].m[id];
        theatreId = this.props.id;
        movieId = id;
      }
      this.props.navigator.push({
        title: 'Showtimes',
        id: 'Showtimes',
        component: Showtimes,
        passProps: {
          showtimes: showtimes,
          listings: this.props.listings,
          movieId: movieId,
          theatreId: theatreId
        }
      });
    } else {
      var theatres = {};
      var movies = {};
      if (this.movieMode()) {
        for (var theatreId in this.props.theatres) {
          if (this.props.theatres[theatreId].m[id]) {
            theatres[theatreId] = this.props.theatres[theatreId];
          }
        }
        theatres = theatres;
      } else {
        for (var movieId in this.props.theatres[id].m) {
          movies[movieId] = this.props.movies[movieId];
        }
        movies = movies;
      }
      this.props.navigator.push({
        id: 'SearchResults',
        title: 'Choose ' + (this.movieMode() ? 'Theater' : 'Movie'),
        component: SearchResults,
        passProps: {
          listings: this.props.listings,
          movies: movies,
          theatres: theatres,
          id: id,
          movieMode : !this.movieMode()
        }
      });
    }
  }

  movieMode() {
    if (this.props.movieMode === undefined) {
      return this.state.selectedIndex == 0;
    } else {
      return this.props.movieMode;
    }
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
    if (this.state.noResults) {
      text = rowData;
      image = (<View/>);
    } else if (this.movieMode()) {
      text = this.props.listings.movies[rowData].name;
      image = (<Poster movieId={rowData}></Poster>);
    } else {
      text = this.props.listings.theatres[rowData].name;
      image = (<View/>);
    }
    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData)}
      underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            {image}
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>{text}</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }

  onSectionHeaderChange(event) {
    var selectedIndex = event.nativeEvent.selectedSegmentIndex;
    var searchText = this.movieMode() ? this.state.theatreSearchText : this.state.movieSearchText;
    this.setState({
      selectedIndex: selectedIndex,
      searchText: searchText
    });
  }

  onTabHeaderChange(event) {
    var selectedIndex = event.i;
    var searchText = this.movieMode() ? this.state.theatreSearchText : this.state.movieSearchText;
    this.setState({
      selectedIndex: selectedIndex,
      searchText: searchText
    });
  }

  // onSectionHeaderMovie(event) {
  //   this.setState({
  //     selectedIndex: 0
  //   });
  // }
  // onSectionHeaderTheatre(event) {
  //   this.setState({
  //     selectedIndex: 1
  //   });
  // }

  renderSectionHeader(rowData, sectionID, rowID, highlightRow) {
    if (!this.props.id) {
      if (Platform.OS === 'android') {
        return (
          <ScrollableTabView
            onChangeTab={this.onTabHeaderChange.bind(this)}
            tabBarBackgroundColor={'deepskyblue'}
            tabBarActiveTextColor={'white'}
            tabBarInactiveTextColor={'gainsboro'}
            tabBarUnderlineColor={'gainsboro'}
            style={{paddingTop: 10, backgroundColor:'deepskyblue'}}
            >
            <View tabLabel="Movies" />
            <View tabLabel="Theatres" />
          </ScrollableTabView>
          // <View style={[styles.sectionHeaderContainer, styles.rowContainer]}>
          //   <TouchableHighlight style={[styles.button, !this.movieMode() ? styles.notSelectedButton : {}]}
          //       onPress={this.onSectionHeaderMovie.bind(this)}
          //       underlayColor='#666688'>
          //     <Text style={[styles.buttonText, !this.movieMode() ? styles.notSelectedText : {} ]}>Movies</Text>
          //   </TouchableHighlight>
          //   <TouchableHighlight style={[styles.button, this.movieMode() ? styles.notSelectedButton : {}]}
          //       onPress={this.onSectionHeaderTheatre.bind(this)}
          //       underlayColor='#666688'>
          //     <Text style={[styles.buttonText, this.movieMode() ? styles.notSelectedText : {} ]}>Theaters</Text>
          //   </TouchableHighlight>
          // </View>
        );
      } else {
        return (
          <View style={styles.sectionHeaderContainer}>
            <SegmentedControlIOS
              style={styles.sectionHeader}
              values={['Movies', 'Theaters']}
              selectedIndex={this.state.selectedIndex}
              onChange={this.onSectionHeaderChange.bind(this)}
            />
          </View>
        );
      }

    } else {
      return <View/>;
    }
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
      ).sort((a,b) => this.props.theatres[a].name.localeCompare(this.props.theatres[b].name)));
      this.setState({
        theatreDataSource: dataSource.cloneWithRows(results),
        searchText: event.nativeEvent.text,
        theatreSearchText: event.nativeEvent.text
      });
    }
    this.setState({ noResults: results.length <= 1 });
  }

  render() {
    var dataSource;
    if (this.state.noResults) {
      dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.guid !== r2.guid }).cloneWithRows(['', 'No results']);
    } else if (this.movieMode()) {
      dataSource = this.state.movieDataSource;
    } else {
      dataSource = this.state.theatreDataSource;
    }
    return (
        <ListView
          dataSource={dataSource}
          keyboardShouldPersistTaps={true}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          enableEmptySections={true}
        />
    );
  }
}

module.exports = SearchResults;
