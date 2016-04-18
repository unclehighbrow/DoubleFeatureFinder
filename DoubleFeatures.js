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
    all.push([movieId,showtime]);
    if (this.props.listings.theatres[theatreId].m[movieId][showtime]['a']) {
      all = all.concat(this.props.listings.theatres[theatreId].m[movieId][showtime]['a']);
    }
    console.log(JSON.stringify(all));
    all = all.sort((a,b) => a[1] > b[1] ? 1 : -1); 
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid
    }).cloneWithRows(all);
    this.state = {
      dataSource: dataSource
    }
  }

  renderRow(rowData, sectionId, rowId) {
    var titleStyle = rowData[0] == this.props.movieId ? styles.mainMovie : styles.title;
    return (
      <TouchableHighlight
      underlayColor='#dddddd' backgroundColor='{backgroundColor}'>
        <View>
          <View style={styles.rowContainer}>
            <View style={[styles.textContainer, styles.row]}>
              <Text style={[titleStyle, styles.left]} numberOfLines={1} >
                {Util.minsToTime(rowData[1])}
              </Text>
              <Text style={[titleStyle, styles.titleRight]} numberOfLines={1}>
                {this.props.listings.movies[rowData[0]].name}
              </Text>
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
