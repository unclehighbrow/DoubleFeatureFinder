'use strict';

var React = require('react-native');
var SearchResults = require('./SearchResults');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component,
  Platform
} = React;

var catchphrase = (<Text>Never <Text style={{fontStyle: 'italic'}}>sneak</Text> into movies!</Text>);

class SearchPage extends Component {

  componentDidMount() {
    this.setState({
      isLoading: false,
      message: 'Getting your position...',
      isLocating: true
    });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.findZip(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        this.setState({
          isLocating: false,
          message: catchphrase
        });
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  findZip(lat, lon) {
    fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon)
      .then(response => response.json())
      .then(json => {
        if (json && json.results && json.results[0].address_components) {
          var addressComponents = json.results[0].address_components;
          for (var i = 0; i < addressComponents.length; i++) {
            if (addressComponents[i].types[0] == 'postal_code') {
              this.setState({
                  zipcode: addressComponents[i].short_name,
                  isLocating: false,
                  message: catchphrase
              });
            }
          }
        }
      })
      .catch(error => {});
  }

  handleResponse(response) {
    this.setState({isLoading: false, message: catchphrase});
    this.props.navigator.push({
      id: 'SearchResults',
      title: 'Results',
      component: SearchResults,
      passProps: {
        listings: response,
        movies: response.movies,
        theatres: response.theatres
      }
    });
  }

  onSearchPressed() {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true, message: 'Please wait...' });
      fetch('http://dubfeatfind.appspot.com/?j=1&zipcode=' + this.state.zipcode)
        .then(response => response.json())
        .then(json => this.handleResponse(json))
        .catch(error => {
          console.log('error:' + error);
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
      isLocating: false
    };
  }

  render() {
    var spinner = this.state.isLoading ? (<ActivityIndicatorIOS size='large' style={styles.spinner} />) : (<View/>);
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Enter your zip to find double features</Text>
			  <TextInput
				  style={styles.searchInput}
          value={this.state.zipcode}
          onChange={this.onSearchTextChanged.bind(this)}
          keyboardType='numeric'
				  placeholder='zip'/>
			  <TouchableHighlight style={styles.button}
            onPress={this.onSearchPressed.bind(this)}
			      underlayColor='#666688'>
			    <Text style={styles.buttonText}>Go</Text>
			  </TouchableHighlight>
        <Text style={styles.message}>{this.state.message}</Text>
        {spinner}
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
    color: mainColor
  },
  container: {
    padding: 30,
    alignItems: 'center',
    flex: 1
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
	  backgroundColor: mainColor,
	  borderColor: mainColor,
	  borderWidth: 1,
	  borderRadius: 8,
    marginTop: 20,
	  justifyContent: 'center'
	},
	searchInput: {
	  height: 100,
	  padding: 4,
    marginRight: Platform.OS === 'android' ? 40: 5,
    marginLeft: Platform.OS === 'android' ? 40: 5,
    fontSize: Platform.OS === 'android' ? 80 : 90,
	  borderWidth: 1,
	  borderColor: mainColor,
	  borderRadius: 8,
	  color: mainColor,
    marginTop : 20,
    textAlign: 'center',
	},
  spinner: {
    marginTop: 20
  }
});

module.exports = SearchPage;
