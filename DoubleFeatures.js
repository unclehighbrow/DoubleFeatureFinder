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
    var data = {};
    var sections = [];
    this.props.dfs.map((df) => {
      var section = df[0];
      if (sections.indexOf(section) === -1) {
        sections.push(section);
        data[section] = [];
      }
      data[section].push(df);
    });

    for (var theatreId in data) {
      data[theatreId].sort((a,b) => parseInt(a[2]) > parseInt(b[2]) ? 1 : -1);
    }
    sections.sort((a,b) => this.props.theatres[a].ordinal > this.props.theatres[b].ordinal ? 1 : -1);

    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid !== r2.guid,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }).cloneWithRowsAndSections(data, sections);
    this.state = {
      dataSource: dataSource
    }
  }

  renderRow(rowData, sectionId, rowId) {
    return (
      <View style={{flexDirection:'row'}}>
        <View style={{flex: 1, padding:5, height: 180}}>
          <Poster movieId={rowData[3]} style={{position:'absolute', top: 35, left: 35}} />
          <Poster movieId={rowData[1]} style={{position:'absolute', top: 5, left: 5}} />
        </View>
        <View style={{flex: 2, flexDirection: 'row', height:180, alignItems:'center'}}>
          <View style={{flex: 1, padding: 10, marginTop:25}}>
            <View style={{height: 90, flex:1}}>
              <Text style={[styles.time, {fontWeight:'bold'}]}>{Util.minsToTime(parseInt(rowData[2]))}</Text>
              <Text style={[styles.time, {fontSize: 10, textAlign:'center'}]}>to</Text>
              <Text style={styles.time}>{Util.minsToTime(parseInt(rowData[2]) + parseInt(this.props.listings.movies[rowData[1]].duration))}</Text>
            </View>
            <View style={{height: 90, flex:1}}>
              <Text style={[styles.time, {fontWeight:'bold'}]}>{Util.minsToTime(parseInt(rowData[4]))}</Text>
              <Text style={[styles.time, {fontSize: 10, textAlign:'center'}]}>to</Text>
              <Text style={styles.time}>{Util.minsToTime(parseInt(rowData[4]) + parseInt(this.props.listings.movies[rowData[3]].duration))}</Text>
            </View>
          </View>
          <View style={{flex: 2, flexDirection: 'column',padding: 10, marginTop:15}}>
            <View style={{height:90}}>
              <Text style={[styles.title, {}]} numberOfLines={3}>{this.props.listings.movies[rowData[1]]['name']}</Text>
            </View>
            <View style={{height:90}}>
              <Text style={[styles.title, {}]} numberOfLines={3}>{this.props.listings.movies[rowData[3]]['name']}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Here are your double features. Enjoy your day at the movies!</Text>
      </View>
    );
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{this.props.listings.theatres[sectionID]['name']}</Text>
      </View>
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View style={styles.separator} ></View>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        renderHeader={this.renderHeader.bind(this)}
        renderSectionHeader={this.renderSectionHeader.bind(this)}
        renderSeparator={this.renderSeparator.bind(this)}
      />
    );
  }
}

module.exports = DoubleFeatures;
