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
var Poster = require('./Poster');


class DoubleFeatures extends Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid
    }).cloneWithRows(this.props.dfs);
    this.state = {
      dataSource: dataSource
    }
  }

  renderRow(rowData, sectionId, rowId) {
    return (
      <TouchableHighlight
      underlayColor='#dddddd' backgroundColor='{backgroundColor}'>
        <View>
          <View style={styles.rowContainer}>
            <View style={[styles.row, {flex:1}]}>
              <Poster movieId={rowData[1]} style={{flex:1}} />
              <View style={{flexDirection: 'column', alignItems:'center', flex: 2}}>
                <Text style={{fontSize: 12, alignSelf:'flex-start'}}>
                  {this.props.listings.movies[rowData[1]]['name']}
                </Text>
                <Text style={{fontSize: 12, alignSelf:'flex-start'}}>
                  {Util.minsToTime(parseInt(rowData[2]))}
                </Text>
                <Text style={{fontSize: 12, alignSelf: 'flex-end'}}>
                  {this.props.listings.movies[rowData[3]]['name']}
                </Text>
                <Text style={{fontSize: 12, alignSelf: 'flex-end'}}>
                  {Util.minsToTime(parseInt(rowData[4]))}
                </Text>
              </View>
              <Poster movieId={rowData[3]} style={{flex:1}} />
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }

  renderHeader() {
    return (
      <View style={{backgroundColor: 'dodgerblue', padding: 20}}>
        <Text style={{color:'white', fontSize: 20}}>Here are your double features. Enjoy your day at the movies!</Text>
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

module.exports = DoubleFeatures;
