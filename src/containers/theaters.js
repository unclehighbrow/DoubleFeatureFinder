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

import Movies from './movies';

import { connect } from 'react-redux'

class Theaters extends Component {

  static defaultProps = {
      theaters: {}
  }

  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this._getTheaterRowIdentities = this._getTheaterRowIdentities.bind(this);
    var rowIdentities = this._getTheaterRowIdentities(props.theaters);
    this.state = {
      theaterDataSource: this.ds.cloneWithRows(props.theaters, rowIdentities)
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    var rowIdentities = this._getTheaterRowIdentities(nextProps.theaters);
    this.setState({
      theaterDataSource: this.ds.cloneWithRows(nextProps.theaters, rowIdentities)
    })
  }

  _getTheaterRowIdentities(theaters) {
    var rowIdentities = Object.keys(theaters).sort((a,b) => theaters[a].ordinal > theaters[b].ordinal ? 1 : -1);
    return rowIdentities;
  }

  render() {
    return(
      <View style={[fdn.container]}>
        <View style={[fdn.bounds]}>
          <View>
            <Text style={[fdn.text]}>Theaters near</Text>
            <Text style={[fdn.text, fdn.textBold]}>{this.props.city}</Text>
          </View>
          <ListView
            style={fdn.list}
            dataSource={this.state.theaterDataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
            />
        </View>
      </View>
    )
  }

  _renderRow(rowData, sectionID, rowID){
    return(
      <TouchableOpacity 
        style={fdn.listItem}
        onPress={()=>{
          this.props.navigator.push({
            component: Movies
          })
        }}
        >
        <View style={fdn.chunk}>
          <Text>{rowData.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => {
  return {
    theaters: state.doubleFeatures.theaters,
    city: state.doubleFeatures.city,
  }
}

const mapDispatchToProps = {
  //fetchLocationFromCountryZip,
  //fetchCurrentPosition
}

export default connect(mapStateToProps, mapDispatchToProps)(Theaters)