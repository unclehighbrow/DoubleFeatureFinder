'use strict';

var React = require('react-native');
var SearchResults = require('./SearchResults');
var Global = require('./Global');
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component,
  Platform,
  Picker,
  PickerIOS
} = React;

var catchphrase = (<Text>Never <Text style={{fontStyle: 'italic'}}>sneak</Text> into movies!</Text>);

class SearchPage extends Component {

  componentDidMount() {
    this.setState({
      isLoading: false,
      message: 'Getting your position...',
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
            if (addressComponents[i].types.includes('postal_code')) {
              this.setState({
                  zipcode: addressComponents[i].short_name,
              });
            }
            if (addressComponents[i].types.includes('country')) {
              this.setState({
                  country: addressComponents[i].short_name,
              });
            }
          }
        }
        this.setState({
          isLocating: false,
          message: catchphrase
        });
        if (this.state.zipcode && this.state.country) {
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
      if (!this.state.zipcode.match(/^\d{5}$/)) {
        this.setState({message: "That's not a valid zipcode."});
      } else {
        this.setState({ isLoading: true, message: 'Please wait...' });
        fetch('http://dubfeatfind.appspot.com/?j=1&zipcode=' + this.state.zipcode + '&country=' + this.state.country)
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
      pickingCountry: false
    };
  }

  render() {
    if (!Global.manual) {
      return (
        <View style={[styles.container, {justifyContent: 'center'}]}>
          <Text style={[styles.message, {paddingTop: 40}]}>{this.state.message}</Text>
          <ActivityIndicatorIOS size='large' style={[styles.spinner]} />
        </View>
      );
    }
    var spinner = this.state.isLoading ? (<ActivityIndicatorIOS size='large' style={styles.spinner} />) : (<View/>);
    var country;
    if (this.state.pickingCountry) {
      country = (
        <PickerIOS
          style={styles.picker}
          selectedValue={this.state.country}
          onValueChange={(c) => this.setState({country: c})}>
          <PickerIOS.Item label='Argentina' value='AR' />
          <PickerIOS.Item label='Australia' value='AU' />
          <PickerIOS.Item label='Canada' value='CA' />
          <PickerIOS.Item label='Chile' value='CL' />
          <PickerIOS.Item label='Germany' value='DE' />
          <PickerIOS.Item label='Spain' value='ES' />
          <PickerIOS.Item label='France' value='FR' />
          <PickerIOS.Item label='Italy' value='IT' />
          <PickerIOS.Item label='Mexico' value='MX' />
          <PickerIOS.Item label='New Zealand' value='NZ' />
          <PickerIOS.Item label='Portugal' value='PT' />
          <PickerIOS.Item label='UK' value='UK' />
          <PickerIOS.Item label='US' value='US' />
        </PickerIOS>
      );
    } else {
      country = (
        <View style={{width:140, alignSelf: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 58}} onPress={() => this.setState({pickingCountry: true})}>{this.state.country}</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', marginTop: 100, marginBottom: 30}}>
  			  <TextInput
  				  style={styles.searchInput}
            value={this.state.zipcode}
            onChange={this.onSearchTextChanged.bind(this)}
            keyboardType='numeric'
  				  placeholder='zip' />
          {country}
        </View>
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
	  justifyContent: 'center',
    marginTop: 20,
	},
	searchInput: {
	  height: 80,
    fontSize: 58,
	  borderWidth: 1,
	  borderColor: mainColor,
	  borderRadius: 5,
	  color: mainColor,
    textAlign: 'center',
    width: 190,
    marginRight: 20,
    flex: 4,
    alignSelf: 'center'
	},
  picker: {
    flex: 1,
    width: 140,
    height: 180
  },
  spinner: {
    marginTop: 20
  }
});

module.exports = SearchPage;
