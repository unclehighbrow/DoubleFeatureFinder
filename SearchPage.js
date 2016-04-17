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

class SearchPage extends Component {

  handleResponse(response) {
    this.setState({isLoading: false, message: 'Never sneak into movies!'});
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
    this.setState({ isLoading: true, message: 'Please wait...' });
    fetch('http://dubfeatfind.appspot.com/?j=1&zipcode=' + this.state.zipcode)
      .then(response => response.json())
      .then(json => this.handleResponse(json))
      .catch(error => this.setState({isLoading: false, message: 'There was an error.'}));
  }

  onSearchTextChanged(event) {
    this.setState({zipcode: event.nativeEvent.text});
  }

  constructor(props) {
    super(props);
    this.state = {
      zipcode: '11201',
      isLoading: false,
      message: 'Never sneak into movies!'
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
				  placeholder='ZIP'/>
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
    fontSize: Platform.OS === 'android' ? 80 : 100,
	  borderWidth: 1,
	  borderColor: mainColor,
	  borderRadius: 8,
	  color: mainColor,
    marginTop : 20
	},
  spinner: {
    marginTop: 20
  }
});

module.exports = SearchPage;
