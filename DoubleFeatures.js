var React = require('react-native');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component,
  ListView
} = React;

var Util = require('./Util');
var styles = require('./Styles');

class DoubleFeatures extends Component {
  constructor(props) {
    super(props);
    var all = [];
    var movieId = this.props.movieId;
    var theatreId = this.props.theatreId;
    var showtime = this.props.showtime;
    if (this.props.listings.theatres[theatreId].m[movieId][showtime]['b']) {
      all = all.concat(this.props.listings.theatres[theatreId].m[movieId][showtime]['b']);
    }
    all.push(new Array(movieId,showtime));
    if (this.props.listings.theatres[theatreId].m[movieId][showtime]['a']) {
      all = all.concat(this.props.listings.theatres[theatreId].m[movieId][showtime]['a']);
    }
    console.dir(all);
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid
    }).cloneWithRows(all);
    this.state = {
      dataSource: dataSource
    }
  }

  renderRow(rowData, sectionId, rowId) {
    console.dir(rowData);
    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData)}
      underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>{this.props.listings.movies[rowData[0]].name} {Util.minsToTime(rowData[1])}</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
      />
    );
  }
}

module.exports = DoubleFeatures;
