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
  ScrollView
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
      dataSource: movieDataSource,
      selectedIndex: 0,
      movieDataSource: movieDataSource,
      theatreDataSource: theatreDataSource
    };
  }

  rowPressed(theatreId) {
    // next
  }

  renderRow(rowData, sectionId, rowId) {
    var text;
    if (this.state.selectedIndex == 0) {
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
    var ds = selectedIndex == 0 ? this.state.movieDataSource : this.state.theatreDataSource;
    this.setState({
      selectedIndex: selectedIndex,
      dataSource: ds
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

  render() {
    return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
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
  }
});

module.exports = SearchResults;
