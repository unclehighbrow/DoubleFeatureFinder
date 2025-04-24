"use strict";

import React, { Component, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

import { geocode } from "@/constants/Api";
import { ListingsContext } from "@/constants/Context";

const catchphrase = "Never sneak into movies!";

const SearchPage = () => {
  const router = useRouter();
  const { listings, setListings } = useContext(ListingsContext);

  const [isLocating, setIsLocating] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState("Getting your location...");
  const [zipcode, setZipcode] = React.useState("");
  const [manual, setManual] = React.useState(false);
  const [date, setDate] = React.useState(0);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setIsLocating(false);
        setMessage("Choose a location and date.");
        setManual(true);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      findZip(location.coords.latitude, location.coords.longitude);
    }

    getCurrentLocation();
  }, []);

  const findZip = (lat, lon) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${geocode}&latlng=${lat},${lon}`
    )
      .then((response) => response.json())
      .then((json) => {
        let localZipcode = "";
        if (json && json.results && json.results[0].address_components) {
          var addressComponents = json.results[0].address_components;
          for (var i = 0; i < addressComponents.length; i++) {
            if (addressComponents[i].types.includes("postal_code")) {
              localZipcode = addressComponents[i].short_name;
              setZipcode(addressComponents[i].short_name);
            }
          }
        }
        if (localZipcode.length > 0) {
          setIsLocating(false);
          setMessage(catchphrase);
          onSearchPressed(localZipcode);
        } else {
          setIsLocating(false);
          setMessage("Choose a location and date.");
          setManual(true);
        }
      })
      .catch((error) => {});
  };

  const handleResponse = (response) => {
    if (Object.keys(response.movies).length < 1) {
      setIsLoading(false);
      setMessage("There was an error retreiving showtimes.");
      setManual(true);
      return;
    }
    setIsLoading(false);
    setMessage(catchphrase);
    setListings(response);
    router.navigate({
      pathname: "SearchResults",
      params: {
        page: 1,
      },
    });
  };

  const onSearchPressed = (localZipcode) => {
    if (!isLoading) {
      setIsLoading(true);
      setMessage("Please wait...");
      fetch(
        "https://dubfeatfind.appspot.com/?j=1&zipcode=" +
          (localZipcode || zipcode) +
          "&date=" +
          date
      )
        .then((response) => response.json())
        .then((json) => handleResponse(json))
        .catch((error) => {
          console.log("error:" + error);
          setIsLoading(false);
          setMessage("There was an error.");
          setManual(true);
        });
    }
  };

  if (!manual) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={[styles.message, { paddingTop: 40 }]}>{message}</Text>
        <ActivityIndicator size="large" style={[styles.spinner]} />
      </View>
    );
  }
  var spinner = isLoading ? (
    <ActivityIndicator size="large" style={styles.spinner} />
  ) : (
    <View style={{ height: 56 }} />
  );
  return (
    <View style={{ flex: 1, backgroundColor: "whitesmoke" }}>
      <View style={styles.container}>
        <View style={{ marginTop: 30 }}>
          <Text style={styles.message}>{message}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.searchInput}
            value={zipcode}
            onChange={(event) => setZipcode(event.nativeEvent.text)}
            keyboardType="numbers-and-punctuation"
            placeholder="zip"
          />
          {/* <Picker
              style={styles.datePicker}
              selectedValue={this.state.date}
              onValueChange={(d) => this.setState({ date: d })}
            >
              <Picker.Item label="Today" value="0" />
              <Picker.Item label="Tomorrow" value="1" />
              <Picker.Item label="Next Day" value="2" />
            </Picker> */}
        </View>
        <TouchableHighlight
          style={styles.button}
          onPress={onSearchPressed}
          underlayColor="#666688"
        >
          <Text style={styles.buttonText}>Go</Text>
        </TouchableHighlight>
        {spinner}
      </View>
      <View style={styles.separator} />
    </View>
  );
};

var mainColor = "#222222";
var styles = StyleSheet.create({
  message: {
    marginTop: 10,
    fontSize: 18,
    textAlign: "center",
    color: mainColor,
  },
  container: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "white",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    alignSelf: "center",
  },
  button: {
    height: 40,
    alignSelf: "center",
    width: 70,
    backgroundColor: "dodgerblue",
    borderColor: "dodgerblue",
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: "center",
  },
  searchInput: {
    height: Platform.OS === "ios" ? 38 : 50,
    fontSize: 25,
    color: mainColor,
    textAlign: "center",
    width: 80,
    marginRight: 10,
    alignSelf: "center",
    borderColor: mainColor,
    borderWidth: Platform.OS === "ios" ? 1 : 0,
    borderRadius: Platform.OS === "ios" ? 5 : 0,
  },
  countryPicker: {
    width: 120,
    height: 215,
  },
  datePicker: {
    width: Platform.OS === "ios" ? 100 : 120,
    height: Platform.OS === "ios" ? 10 : 215,
  },
  spinner: {
    marginTop: 20,
    alignSelf: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#dddddd",
  },
});

export default SearchPage;
