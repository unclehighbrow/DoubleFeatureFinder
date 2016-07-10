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
var swatches = require('../components/swatches');

import { connect } from 'react-redux'
import { fetchDoubleFeatures, fetchCurrentPosition, fetchLocationFromCountryZip } from '../actions'

import Theaters from './theaters';

import moment from 'moment';

class LocationModal extends Component {

	constructor(props){
		super(props);
    this.state = {
      zip: '',
      country: '',
      pickerOriginalHeight: 500,
      pickerHeight: new Animated.Value(0),
      pickerFocus: false
    }
    this._togglePicker = this._togglePicker.bind(this);
	}

  static defaultProps = {
    supportedCountries: {
      'AR': 'Argentina', 
      'AU': 'Australia', 
      'CA': 'Canada', 
      'CL': 'Chile',  
      'FR': 'France',
      'DE': 'Germany', 
      'IT': 'Italy', 
      'MX': 'Mexico', 
      'NZ': 'New Zealand', 
      'PT': 'Portugal', 
      'ES': 'Spain',
      'UK': 'United Kingdom', 
      'US': 'United States'
    },
    selectableDates: [] 
  }

  componentDidMount(){
    this.setState({
      zip: this.props.zip, 
      country: this.props.country
    })
  }

  _togglePicker(){
    var newPickerFocus = !this.state.pickerFocus;
    Animated.timing(this.state.pickerHeight, {
      toValue: (newPickerFocus) ? this.state.pickerOriginalHeight : 0,
      duration: 250
    }).start();
    this.setState({pickerFocus: newPickerFocus});
  }

  render() {
    return (
      <View style={{padding: 16, justifyContent: 'center', flex: 1, backgroundColor: swatches.modalShade, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
        <View style={{backgroundColor: 'white', borderRadius: 10, flex: 0, overflow: 'hidden'}}>
            <View style={[fdn.bounds, fdn.chunk]}>
              <Text style={[{fontSize: 24, fontWeight: '600'}, fdn.textAlignCenter]}>Where you at?</Text>
            </View>
            <View style={[fdn.tableCell, fdn.row]}>
              <View style={[fdn.rowItemShrink, {justifyContent: 'center'}]}>
                <Text style={[fdn.text ]}>
                  {(this.state.country == 'US' ? 'ZIP code' : 'Postal code')}
                </Text>
              </View>
              <TextInput
                style={[fdn.rowItemGrow, fdn.text, fdn.textSecondary, {height: 44, paddingRight: 16, textAlign: 'right'}]}
                value={this.state.zip}
                keyboardType='name-phone-pad'
                onChangeText={(text) => this.setState({zip: text})}
                 />
            </View>

            <View style={[fdn.tableCell]}>
            <TouchableOpacity 
              onPress={this._togglePicker}
              >
              <View style={fdn.row}>
                <View style={[fdn.rowItemGrow, {justifyContent: 'center', height: 44}]}>
                  <Text style={[fdn.text]}>
                    Country
                  </Text>
                </View>
                <View style={[fdn.rowItemGrow, {justifyContent: 'center', height: 44, paddingRight: 16}]}>
                  <Text style={[fdn.text, fdn.textSecondary, fdn.textAlignRight, {color: (this.state.pickerFocus) ? swatches.link: swatches.textSecondary}]}>
                    {this.props.supportedCountries[this.state.country]}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
              <Animated.View 
                style={{
                  height: this.state.pickerHeight,
                  overflow: 'hidden'
                }}>
                <View 
                  onLayout={(event) => {
                    var {x, y, width, height} = event.nativeEvent.layout;
                    if(this.state.pickerOriginalHeight > 0){
                      this.setState({pickerOriginalHeight: height});
                    }
                  }}>
                  <Picker
                    style={{padding: 0}}
                    itemStyle={[fdn.text]}
                    selectedValue={this.state.country}
                    onValueChange={(c) => this.setState({country: c})}
                    
                    >
                    { Object.keys(this.props.supportedCountries).map((key, i) => {
                      return(
                        <Picker.Item key={i} label={this.props.supportedCountries[key]} value={key} />
                        );
                    })}
                  </Picker>
                </View>
              </Animated.View>
            </View>

            <TouchableOpacity 
              style={{backgroundColor: 'dodgerblue', padding: 14, marginTop: 8 }}
              onPress={()=>{
                this.props.fetchLocationFromCountryZip(this.state.country, this.state.zip);
              }}
              >
              <Text style={[fdn.text, fdn.textPrimaryInverted, fdn.textAlignCenter]}>Go!</Text>
            </TouchableOpacity>
        </View>
      </View>
    )
  }
}


/*

didMount: attempt to get device location
render: 
  if not attempting to get device location && no location set, show location modal (no dismiss)
  if requested to change location and not accepted yet, show location modal 

*/


class Search extends Component {

  static get defaultProps() {
    var dates = [];
    for(var i=0; i<14; i++){
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
            <Text style={[fdn.text]}>Going to find some double features for</Text>
            <TouchableOpacity onPress={this._showLocationModal}>
              <Text style={[fdn.text, fdn.textBold]}>{this.props.city} {this.props.country} {this.props.zip}</Text>
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
          <Text>{moment(rowData.moment).calendar(null, {
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
