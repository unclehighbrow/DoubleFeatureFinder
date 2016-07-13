/* show double features */
'use strict';

import React, {
  Component,
} from 'react';

import ReactNative, {
  AppRegistry,
  StyleSheet,
  ListView,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Animated,
} from 'react-native';

import fdn from '../components/foundation';
import swatches from '../components/swatches';

import { connect } from 'react-redux'


class DoubleFeatures extends Component {

  static defaultProps = {
      doubleFeatures: {}
  }

  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this._getDoubleFeatureRowIdentities = this._getDoubleFeatureRowIdentities.bind(this);
    var rowIdentities = this._getDoubleFeatureRowIdentities(props.doubleFeatures);
    this.state = {
      theaterDataSource: this.ds.cloneWithRows(props.doubleFeatures, rowIdentities)
    }
  }

  componentWillReceiveProps(nextProps) {
    var rowIdentities = this._getDoubleFeatureRowIdentities(nextProps.doubleFeatures);
    this.setState({
      theaterDataSource: this.ds.cloneWithRows(nextProps.doubleFeatures, rowIdentities)
    })
  }

  _getDoubleFeatureRowIdentities(doubleFeatures) {
    var rowIdentities = Object.keys(doubleFeatures).sort((a,b) => doubleFeatures[a].ordinal > doubleFeatures[b].ordinal ? 1 : -1);
    return rowIdentities;
  }

  render() {
    return(
      <View style={[fdn.container]}>
        <View style={[fdn.bounds]}>
          <View>
            <Text style={[fdn.text]}>Here are your double features</Text>
          </View>
          <ListView
            style={fdn.list}
            dataSource={this.state.doubleFeatureDataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
            />
        </View>
      </View>
    )
  }

  _renderRow(rowData, sectionID, rowID){
    return(
      <View
        style={fdn.listItem}
        >
        <View style={fdn.chunk}>
          <Text style={[fdn.text]}>stuff</Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    doubleFeatures: state.doubleFeatures.doubleFeatures,
    city: state.doubleFeatures.city,
  }
}

const mapDispatchToProps = {
  //selectDoubleFeature
}

export default connect(mapStateToProps, mapDispatchToProps)(DoubleFeatures)