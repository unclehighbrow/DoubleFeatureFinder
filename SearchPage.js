'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Picker,
  Platform
} from 'react-native';

var SearchResults = require('./SearchResults');
var Global = require('./Global');


var catchphrase = (<Text>Never <Text style={{fontStyle: 'italic'}}>sneak</Text> into movies!</Text>);
var countries = ['AR', 'AU', 'CA', 'CL', 'DE', 'ES', 'FR', 'IT', 'MX', 'NZ', 'PT', 'UK', 'US'];
// AR C1420 i
// AU 2000 i
// CA H3R 1K2 g
// CL 872 0019 i
// DE 10117 i
// ES 08000 i
// FR 97100 i
// IT 00118 i
// MX 22000 i
// PT 1000 i
// UK W11 2BD g
// US 11201 g

class SearchPage extends Component {

  componentDidMount() {
    this.setState({
      isLoading: false,
      message: 'Getting your location...',
      isLocating: true
    });
    this.findPosition();
  }

  findPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.findZip(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        Global.manual = true;
        this.setState({
          isLocating: false,
          message: "Choose a location and date.",
        });
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 100000}
    );
  }

  findZip(lat, lon) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCftnTZ8M0jwdS742d1BQV1F-zIeSNQHQg&latlng=' + lat + ',' + lon)
      .then(response => response.json())
      .then(json => {
        if (json && json.results && json.results[0].address_components) {
          var addressComponents = json.results[0].address_components;
          for (var i = 0; i < addressComponents.length; i++) {
            if (addressComponents[i].types.includes('postal_code')) {
              this.setState({
                  zipcode: addressComponents[i].short_name,
              });
            }
            if (addressComponents[i].types.includes('country')) {
              var country = addressComponents[i].short_name;
              if (countries.includes(country)) {
                this.setState({
                  country: country,
                });
              }
            }
          }
        }
        if (!this.state.country || !this.state.zipcode) {
          Global.manual = true;
          this.setState({
            isLocating: false,
            message: "Choose a location and date.",
          });
        } else {
          this.setState({
            isLocating: false,
            message: catchphrase
          });
          this.onSearchPressed();
        }
      })
      .catch(error => {});
  }

  handleResponse(response) {
    if (Object.keys(response.movies).length < 1) {
      Global.manual = true;
      this.setState({isLoading: false, message: 'There was an error.'});
      return;
    }
    this.setState({isLoading: false, message: catchphrase});
    this.props.navigator.push({
      id: 'SearchResults',
      title: 'Choose Theater',
      component: SearchResults,
      passProps: {
        listings: response,
        movies: response.movies,
        theatres: response.theatres,
        page: 1,
      }
    });
  }

  onSearchPressed() {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true, message: 'Please wait...' });
      fetch('https://dubfeatfind.appspot.com/?j=1&zipcode=' + this.state.zipcode + '&country=' + this.state.country + '&date=' + this.state.date)
        .then(response => response.json())
        .then(json => this.handleResponse(json))
        .catch(error => {
          console.log('error:' + error);
          Global.manual = true;
          this.setState({
            isLoading: false, message: 'There was an error.'
          })
        });
    }
  }

  onSearchTextChanged(event) {
    this.setState({zipcode: event.nativeEvent.text});
  }

  constructor(props) {
    super(props);
    this.state = {
      zipcode: '',
      isLoading: false,
      message: catchphrase,
      isLocating: true,
      country: 'US',
      date: 0,
    };
  }

  render() {
    if (!Global.manual) {
      return (
        <View style={[styles.container, {justifyContent: 'center'}]}>
          <Text style={[styles.message, {paddingTop: 40}]}>{this.state.message}</Text>
          <ActivityIndicator size='large' style={[styles.spinner]} />
        </View>
      );
    }
    var spinner = this.state.isLoading ? (<ActivityIndicator size='large' style={styles.spinner} />) : (<View style={{height:56}} />);
    return (
      <View style={{flex:1, backgroundColor:'whitesmoke'}}>
      <View style={styles.container}>
        <View style={{marginTop:30}}>
          <Text style={styles.message}>{this.state.message}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
  			  <TextInput
  				  style={styles.searchInput}
            value={this.state.zipcode}
            onChange={this.onSearchTextChanged.bind(this)}
            keyboardType='numbers-and-punctuation'
  				  placeholder='zip' />
          <Picker
            style={styles.countryPicker}
            selectedValue={this.state.country}
            onValueChange={(c) => this.setState({country: c})}>
            <Picker.Item label='Argentina' value='AR' />
            <Picker.Item label='Australia' value='AU' />
            <Picker.Item label='Canada' value='CA' />
            <Picker.Item label='Chile' value='CL' />
            <Picker.Item label='Germany' value='DE' />
            <Picker.Item label='Spain' value='ES' />
            <Picker.Item label='France' value='FR' />
            <Picker.Item label='Italy' value='IT' />
            <Picker.Item label='Mexico' value='MX' />
            <Picker.Item label='Portugal' value='PT' />
            <Picker.Item label='UK' value='UK' />
            <Picker.Item label='US' value='US' />
          </Picker>
          <Picker style={styles.datePicker} selectedValue={this.state.date} onValueChange={(d) => this.setState({date: d})}>
            <Picker.Item label='Today' value='0' />
            <Picker.Item label='Tomorrow' value='1' />
            <Picker.Item label='Next Day' value='2' />
          </Picker>
        </View>
        <TouchableHighlight style={styles.button}
            onPress={this.onSearchPressed.bind(this)}
			      underlayColor='#666688'>
			    <Text style={styles.buttonText}>Go</Text>
			  </TouchableHighlight>
        {spinner}
      </View>
      <View style={styles.separator} />
    </View>
    );
  }
}

var mainColor = '#222222';
var styles = StyleSheet.create({
  message: {
    marginTop: 10,
    fontSize: 18,
    textAlign: 'center',
    color: mainColor,
  },
  container: {
    padding: 30,
    alignItems: 'center',
    backgroundColor:'white'
  },
	buttonText: {
	  fontSize: 18,
	  color: 'white',
	  alignSelf: 'center'
	},
	button: {
	  height: 40,
    alignSelf: 'center',
    width: 70,
	  backgroundColor: 'dodgerblue',
	  borderColor: 'dodgerblue',
	  borderWidth: 1,
	  borderRadius: 12,
	  justifyContent: 'center',
	},
	searchInput: {
    height: Platform.OS === 'ios' ? 38 : 50,
    fontSize: 25,
	  color: mainColor,
    textAlign: 'center',
    width: 80,
    marginRight: 10,
    alignSelf:'center',
    borderColor: mainColor,
    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderRadius: Platform.OS === 'ios' ? 5 : 0
	},
  countryPicker: {
    width: 120,
    height: 215
  },
  datePicker: {
    width: Platform.OS === 'ios' ? 100 : 120,
    height: Platform.OS === 'ios' ? 10 : 215,
  },
  spinner: {
    marginTop: 20,
    alignSelf:'center'
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
});

module.exports = SearchPage;
