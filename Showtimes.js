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

var Poster = require('./Poster');
var DoubleFeatures = require('./DoubleFeatures');
var Util = require('./Util');
var styles = require('./Styles');

class Showtimes extends Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid
    }).cloneWithRows(Object.keys(this.props.showtimes).sort((a,b) => parseInt(a) > parseInt(b)));
    this.state = {
      dataSource: dataSource
    }
  }

  rowPressed(showtime) {
    this.props.navigator.push({
      title: 'Double Features',
      component: DoubleFeatures,
      passProps: {
        showtime: showtime,
        listings: this.props.listings,
        movieId: this.props.movieId,
        theatreId: this.props.theatreId
      }
    });
  }

  renderRow(rowData, sectionId, rowId) {
    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData)}
      underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>{Util.minsToTime(rowData)}</Text>
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

module.exports = Showtimes;
