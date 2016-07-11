/* 
pick from list of theatres based on location
location comes from location services
or manual selection
*/

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
  Picker,
  TextInput,
  Animated,
} from 'react-native';

import fdn from '../components/foundation';
import swatches from '../components/swatches';

import { connect } from 'react-redux'
import { fetchDoubleFeatures, fetchCurrentPosition, fetchLocationFromCountryZip } from '../actions'

import LocationModal from '../components/locationModal';
import Theaters from './theaters';

import moment from 'moment';



class Search extends Component {

  static get defaultProps() {
    var dates = [];

    // next 7 days because why not
    for(var i=0; i<7; i++){
      dates.push({
       moment: moment().add(i, 'd').startOf('day'),
       offset: i
     });
    }

    return {
      dates: dates
    }
  }

  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.state = {
      datesDataSource: this.ds.cloneWithRows(this.props.dates),
      showLocationModal: false
    }
    this._showLocationModal = this._showLocationModal.bind(this);
  }

  componentDidMount() {
    this.props.fetchCurrentPosition();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      datesDataSource: this.ds.cloneWithRows(nextProps.dates)
    })
  }

  _showLocationModal() {
    this.setState({
      showLocationModal: true
    });
  }

  render() {
    return(
      <View style={[fdn.container]}>
        <View style={[fdn.bounds]}>
          <View>
            <Text style={[fdn.text]}>Find double features near</Text>
            <TouchableOpacity onPress={this._showLocationModal}>
              <Text style={[fdn.text, fdn.textBold]}>{this.props.city}</Text>
            </TouchableOpacity>
          </View>
          <ListView
            style={fdn.list}
            dataSource={this.state.datesDataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
            />
        </View>
        { this.state.showLocationModal && 
          <LocationModal zip={this.props.zip} country={this.props.country} fetchLocationFromCountryZip={this.props.fetchLocationFromCountryZip} />
        }
      </View>
    )
  }

  _renderRow(rowData, sectionID, rowID){
    return(
      <TouchableOpacity 
        style={fdn.listItem}
        onPress={()=>{
          this.props.fetchDoubleFeatures(rowData.offset, this.props.country, this.props.zip)
          this.props.navigator.push({
            component: Theaters
          })
        }}
        >
        <View style={fdn.chunk}>
          <Text style={[fdn.text]}>{moment(rowData.moment).calendar(null, {
              sameDay: '[Today], MMMM D',
              nextDay: '[Tomorrow], MMMM D',
              nextWeek: 'dddd, MMMM D',
              sameElse: 'dddd, MMMM D'
          })}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}



const mapStateToProps = state => {
  return {
    dates: state.doubleFeatures.dates,
    city: state.doubleFeatures.city,
    country: state.doubleFeatures.country,
    zip: state.doubleFeatures.zip,
  }
}

const mapDispatchToProps = {
  fetchLocationFromCountryZip,
  fetchCurrentPosition,
  fetchDoubleFeatures
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
