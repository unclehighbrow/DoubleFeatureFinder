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
    }).cloneWithRows(Object.keys(this.props.showtimes).sort((a,b) => parseInt(a) > parseInt(b) ? 1 : -1));
    this.state = {
      dataSource: dataSource
    }
  }

  rowPressed(showtime) {
    this.props.navigator.push({
      id: 'DoubleFeatures',
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
    var before = this.props.listings.theatres[this.props.theatreId].m[this.props.movieId][rowData]['b'];
    var beforeLength = before ? before.length : 0;
    var after = this.props.listings.theatres[this.props.theatreId].m[this.props.movieId][rowData]['a'];
    var afterLength = after ? after.length : 0;
    return (
      <TouchableHighlight onPress={() => this.rowPressed(rowData)}
      underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <View style={[styles.textContainer, styles.row]}>
              <Text style={[styles.title, styles.left]} numberOfLines={1}>
                {beforeLength}
              </Text>
              <Text style={[styles.title, styles.center, styles.mainMovie]} numberOfLines={1}>
                {Util.minsToTime(rowData)}
              </Text>
              <Text style={[styles.title, styles.right]} numberOfLines={1}>
                {afterLength}
              </Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }

  renderHeader() {
    return (
      <View style={styles.rowContainer}>
        <View style={[styles.textContainer, styles.row]}>
          <Text style={styles.left} numberOfLines={1}>
            Before
          </Text>
          <Text style={styles.center} numberOfLines={1}>
            Showtime
          </Text>
          <Text style={styles.right} numberOfLines={1}>
            After
          </Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        renderHeader={this.renderHeader.bind(this)}
      />
    );
  }
}

module.exports = Showtimes;
