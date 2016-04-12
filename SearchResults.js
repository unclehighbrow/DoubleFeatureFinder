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
  TextInput
} = React;

class SearchResults extends Component {
  constructor(props) {
    super(props);
    var movieDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid
    }).cloneWithRows(Object.keys(this.props.listings.movies));
    var theatreDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid
    }).cloneWithRows(Object.keys(this.props.listings.theatres));
    this.state = {
      selectedIndex: 0,
      movieDataSource: movieDataSource,
      theatreDataSource: theatreDataSource,
      movieSearchText: '',
      theatreSearchText: '',
      searchText: ''
    };
  }

  rowPressed(id) {
    // next
  }

  movieMode() {
    return this.state.selectedIndex == 0;
  }

  renderRow(rowData, sectionId, rowId) {
    var text;
    if (this.movieMode()) {
      text = this.props.listings.movies[rowData].name;
    } else {
      text = this.props.listings.theatres[rowData].name;
    }
    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData)}
      underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Text style={styles.thumb}>Image</Text>
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

  renderSectionHeader(rowData, sectionID, rowID, highlightRow) {
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

  onSearchTextChanged(event) {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid
    });
    if (this.movieMode()) {
      this.setState({
        movieDataSource: dataSource.cloneWithRows(
          Object.keys(this.props.listings.movies).filter(
            id => this.props.listings.movies[id].name.toLowerCase().includes(event.nativeEvent.text.toLowerCase())
          )
        ),
        searchText: event.nativeEvent.text,
        movieSearchText: event.nativeEvent.text
      });
    } else {
      this.setState({
        theatreDataSource: dataSource.cloneWithRows(
          Object.keys(this.props.listings.theatres).filter(
            id => this.props.listings.theatres[id].name.toLowerCase().includes(event.nativeEvent.text.toLowerCase())
          )
        ),
        searchText: event.nativeEvent.text,
        theatreSearchText: event.nativeEvent.text
      });
    }
  }

  renderHeader() {
    var placeholder = this.movieMode() ? 'Search Movies' : 'Search Theaters';
    return (
      <TextInput
  		  style={styles.searchInput}
        onChange={this.onSearchTextChanged.bind(this)}
  		  placeholder={placeholder}
        autoCorrect={false}
        clearButtonMode='while-editing'
        autoCapitalize='none'
        value={this.state.searchText}
      />
    );
  }

  render() {
    var dataSource = this.movieMode() ? this.state.movieDataSource : this.state.theatreDataSource;
    return (
        <ListView
          dataSource={dataSource}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          renderHeader={this.renderHeader.bind(this)}
        />
    );
  }
}

var styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 2
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48bbec',
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
  sectionHeaderContainer: {
    marginRight: 12,
    marginLeft: 12,
    paddingTop: 12,
  },
  sectionHeader: {
    backgroundColor: 'white'
  },
  searchInput: {
    height: 35,
    padding: 5,
    marginRight: 12,
    marginLeft: 12,
    marginTop: 10,
    fontSize: 12,
    borderWidth: 1,
    borderRadius: 12,
    color: 'gray'
  }
});

module.exports = SearchResults;
