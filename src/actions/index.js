// *** 
// get double features

export const REQUEST_DOUBLE_FEATURES = "REQUEST_DOUBLE_FEATURES";
export const RECEIVE_DOUBLE_FEATURES = "RECEIVE_DOUBLE_FEATURES";

export const requestDoubleFeatures = (date, country, zip) => {
  return {
    type: REQUEST_DOUBLE_FEATURES,
    date, country, zip,
    movies: {},
    theaters: {},
    selectedTheaterId: null,
    selectedMovieAId: null,
    selectedMovieBId: null,
  }
}

export const receiveDoubleFeatures = (date, country, zip, json) => {
  return {
    type: RECEIVE_DOUBLE_FEATURES,
    date,
    movies: json.movies,
    theaters: json.theatres, // theatres, theaters
    selectedTheaterId: null,
    selectedMovieAId: null,
    selectedMovieBId: null,
    receivedAt: Date.now()
  }
}

export const fetchDoubleFeatures = (date, country, zip) => {
  return dispatch => {
    dispatch(requestDoubleFeatures(date, country, zip));
    return fetch(`http://dubfeatfind.appspot.com/?j=1&zipcode=${zip}&country=${country}&date=${date}`)
      .then(response => response.json() )
      .then(json => {
        dispatch(receiveDoubleFeatures(date, country, zip, json))
      })
  }
}

// *** 
// get geo info from google maps

export const REQUEST_LOCATION = "REQUEST_LOCATION";
export const RECEIVE_LOCATION = "RECEIVE_LOCATION";

export const requestLocation = () => {
  return {
    type: REQUEST_LOCATION,
  }
}

export const receiveLocation = (json) => {
  var countries = ['AR', 'AU', 'CA', 'CL', 'DE', 'ES', 'FR', 'IT', 'MX', 'NZ', 'PT', 'UK', 'US'];
  var city, country, zip, lat, lon;
  if (json && json.results && json.results[0].address_components) {
    var addressComponents = json.results[0].address_components;
    for (var i = 0; i < addressComponents.length; i++) {
      if (addressComponents[i].types.includes('postal_code')) {
        zip = addressComponents[i].short_name;
      }
      if (addressComponents[i].types.includes('country')) {
        var country = addressComponents[i].short_name;
        if (countries.includes(country)) {
          country = country;
        }
      }
      if (addressComponents[i].types.includes('locality')) {
        city = addressComponents[i].long_name;
      }
    }
  }
  if (json && json.results && json.results[0].geometry && json.results[0].geometry.location) {
    var location = json.results[0].geometry.location;
    lat = location.lat;
    lon = location.lng;
  }
  return {
    type: RECEIVE_LOCATION,
    lat, lon,
    country,
    city,
    zip,
    receivedAt: Date.now()
  }
}

export const fetchLocationFromLatLon = (lat, lon) => {
  return dispatch => {
    dispatch(requestLocation(lat, lon));
    return fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon)
        .then(response => response.json())
        .then(json => dispatch(receiveLocation(json)))
  }
}

export const fetchLocationFromCountryZip = (country,zip) => {
  return dispatch => {
    dispatch(requestLocation());
    return fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + zip + ',' + country)
        .then(response => response.json())
        .then(json => dispatch(receiveLocation(json)))
  }
}

// *** 
// device geolocation

export const REQUEST_CURRENT_POSITION = "REQUEST_CURRENT_POSITION";
export const RECEIVE_CURRENT_POSITION = "RECEIVE_CURRENT_POSITION";

export const requestCurrentPosition = () => {
  return {
    type: REQUEST_CURRENT_POSITION
  }
}

export const receiveCurrentPosition = (position) => {
  return dispatch => {
    dispatch(fetchLocationFromLatLon(position.coords.latitude, position.coords.longitude));
    return {
      type: RECEIVE_CURRENT_POSITION,
      coords: position.coords,
      receivedAt: Date.now()
    }
  }
}

export const fetchCurrentPosition = () => {
  return dispatch => {
    dispatch(requestCurrentPosition());
    return navigator.geolocation.getCurrentPosition(
      (position) => { 
          dispatch(receiveCurrentPosition(position)) 
      },
      (error) => { 
        // error.code 
        // 1: permission denied
        // 2: position unavailable
        // 3: timeout
        console.log(error) 
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 100000}
    );
  }
}

// *** 
// selections
export const SELECT_THEATER = "SELECT_THEATER";
export const SELECT_MOVIE_A = "SELECT_MOVIE_A";
export const SELECT_MOVIE_B = "SELECT_MOVIE_B";

export const selectTheater = (selectedTheaterId) => {
  return {
    type: SELECT_THEATER,
    selectedTheaterId,
    selectedMovieAId: null,
    selectedMovieBId: null,    
  }
}

export const selectMovieA = (selectedMovieAId) => {
  return {
    type: SELECT_MOVIE_A,
    selectedMovieAId,
    selectedMovieBId: null,
  }
}

export const selectMovieB = (selectedMovieBId) => {
  return {
    type: SELECT_MOVIE_B,
    selectedMovieBId
  }
}
