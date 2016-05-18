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
          <View style={{flex: 1, flexDirection:'column', padding:5}}>
            <Text style={[styles.title, {paddingBottom: 5, marginLeft: 5}]}>{this.props.listings.movies[rowData[1]]['name']}</Text>
            <View style={styles.row}>
              <Poster movieId={rowData[1]} style={{flex:1}} />
                <View style={{flex:2, flexDirection:'row', alignItems:'center', alignSelf:'center'}}>
                  <View style={{flexDirection: 'column', alignItems:'center', flex:1 }}>
                    <Text style={styles.title}>{Util.minsToTime(parseInt(rowData[2]))}</Text>
                    <Text>to</Text>
                    <Text style={styles.title}>
                      {Util.minsToTime(parseInt(rowData[2]) + parseInt(this.props.listings.movies[rowData[1]].duration))}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'column', alignItems:'center', flex:1}}>
                    <Text style={styles.title}>{Util.minsToTime(parseInt(rowData[4]))}</Text>
                    <Text>to</Text>
                      <Text style={styles.title}>
                        {Util.minsToTime(parseInt(rowData[4]) + parseInt(this.props.listings.movies[rowData[3]].duration))}
                      </Text>
                  </View>
                </View>
              <Poster movieId={rowData[3]} style={{flex:1}} />
            </View>
            <Text style={[styles.title, {textAlign:'right', marginRight: 5}]}>{this.props.listings.movies[rowData[3]]['name']}</Text>
          </View>
          <View style={[styles.separator, {}]} />
        </View>
      </TouchableHighlight>
    );
  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Here are your double features. Enjoy your day at the movies!</Text>
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
