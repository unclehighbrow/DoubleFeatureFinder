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

import Util from '../components/util';

class DoubleFeatures extends Component {

  static defaultProps = {
      doubleFeatures: []
  }

  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({
    	rowHasChanged: (row1, row2) => row1 !== row2,
    	sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this._getDoubleFeatureRowIdentities = this._getDoubleFeatureRowIdentities.bind(this);
    this._getDataAndSections = this._getDataAndSections.bind(this);

    var dataAndSections = this._getDataAndSections(this.props.doubleFeatures);
    var rowIdentities = this._getDoubleFeatureRowIdentities(this.props.theaters, dataAndSections.sections);
    this.state = {
      doubleFeatureDataSource: this.ds.cloneWithRowsAndSections(dataAndSections.data, rowIdentities)
    }
  }

  componentWillReceiveProps(nextProps) {
    var dataAndSections = this._getDataAndSections(nextProps.doubleFeatures);
    var rowIdentities = this._getDoubleFeatureRowIdentities(nextProps.theaters, dataAndSections.sections);
    this.setState({
      doubleFeatureDataSource: this.ds.cloneWithRowsAndSections(dataAndSections.data, rowIdentities)
    })
  }

  _getDataAndSections(dfs) {
  	var data = {};
    var sections = [];
    dfs.map((df) => {
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
    return {
    	data,
    	sections
    };
  }  

  _getDoubleFeatureRowIdentities(theaters, sections) {
    var rowIdentities = sections.sort((a,b) => theatres[a].ordinal > theatres[b].ordinal ? 1 : -1);
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

	var doubleFeatures = Util.findDoubleFeatures(
		state.doubleFeatures.selectedTheaterId, 
		state.doubleFeatures.selectedMovieAId, 
		state.doubleFeatures.selectedMovieBId,
		state.doubleFeatures.theaters
	);

	return {
		doubleFeatures,
		city: state.doubleFeatures.city,
	}
}

const mapDispatchToProps = {
  //selectDoubleFeature
}

export default connect(mapStateToProps, mapDispatchToProps)(DoubleFeatures)