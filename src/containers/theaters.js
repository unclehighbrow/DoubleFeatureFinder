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
var swatches = require('../components/swatches');

import { connect } from 'react-redux'

class Theaters extends Component {

  static defaultProps = {
      theaters: {}
  }

  constructor(props){
    super(props);

    /* 
    TODO: all this data is objects, you need to do the object id thing
    */
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.state = {
      theaterDataSource: this.ds.cloneWithRows(this.props.theaters),
    }
  }

  componentDidMount() {
    //this.props.fetchCurrentPosition();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      theaterDataSource: this.ds.cloneWithRows(nextProps.theaters)
    })
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
      <View style={fdn.listItem}>
        <View style={fdn.chunk}>
          <Text>Theater: {rowData.name}</Text>
        </View>
      </View>
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