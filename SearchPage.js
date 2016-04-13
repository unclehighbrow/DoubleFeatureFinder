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
  Component
} = React;

class SearchPage extends Component {

  handleResponse(response) {
    this.setState({isLoading: false});
    this.props.navigator.push({
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
    this.setState({ isLoading: true });
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

var styles = StyleSheet.create({
  message: {
    marginTop: 30,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center',
  },
	buttonText: {
	  fontSize: 18,
	  color: 'white',
	  alignSelf: 'center'
	},
	button: {
	  height: 36,
    alignSelf: 'center',
    width: 80,
	  flex: 1,
	  flexDirection: 'row',
	  backgroundColor: '#333399',
	  borderColor: '#333399',
	  borderWidth: 1,
	  borderRadius: 8,
    marginTop: 20,
	  justifyContent: 'center'
	},
	searchInput: {
	  height: 100,
	  padding: 4,
	  marginRight: 5,
    marginLeft: 5,
	  fontSize: 100,
	  borderWidth: 1,
	  borderColor: '#333399',
	  borderRadius: 8,
	  color: '#333399'
	},
  spinner: {
    marginTop: 20
  }
});

module.exports = SearchPage;
