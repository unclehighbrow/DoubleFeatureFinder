"use strict";

import React, { Component, useContext, useEffect } from "react";
import {
  View,
  TouchableHighlight,
  FlatList,
  Text,
  TextInput,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ListingsContext } from "@/constants/Context";
import Util from "@/constants/Util";
import styles from "@/constants/Styles";
import Poster from "@/components/Poster";
// var dismissKeyboard = require("react-native-dismiss-keyboard");

const SearchResults = () => {
  const router = useRouter();
  const { page, movieId } = useLocalSearchParams();

  const { listings } = useContext(ListingsContext);
  console.log("SearchResults listings", listings);

  const [moviesList, setMoviesList] = React.useState(
    Object.keys(listings.movies).sort((a, b) =>
      listings.movies[a].name.localeCompare(listings.movies[b].name)
    )
  );
  const [theatresList, setTheatresList] = React.useState(
    Object.keys(listings.theatres).sort((a, b) =>
      listings.theatres[a].ordinal > listings.theatres[b].ordinal ? 1 : -1
    )
  );
  const [movieSearchText, setMovieSearchText] = React.useState("");
  const [theatreSearchText, setTheatreSearchText] = React.useState("");
  const [searchText, setSearchText] = React.useState("");
  const [noResults, setNoResults] = React.useState(false);

  const rowPressed = (id) => {
    // TODO: dimiss keyboard
    // dismissKeyboard();
    if (id == -1) {
      return alert();
    }
    var localMovies = {};
    if (page < 3) {
      if (page == 1) {
        // choosing theater
        if (id == 0) {
          // don't care
          localMovies = moviesList;
        } else {
          for (var movieId in theatresList[id].m) {
            // only movies in this theater
            localMovies[movieId] = moviesList[movieId];
          }
        }
      } else if (page == 2) {
        // choosing first movie
        if (id == 0) {
          // dont care, skip to end screen
          goToDoubleFeatures(0, 0);
          return;
        } else {
          var movieIds;
          if (theatreId == 0) {
            movieIds = Util.findDoubleFeatureMovieIdsInAllTheatres(
              id,
              theatresList
            );
          } else {
            movieIds = Util.findDoubleFeatureMovieIdsInTheatre(
              theatreId,
              id,
              theatresList
            );
          }
          for (let movieId of movieIds) {
            localMovies[movieId] = moviesList[movieId];
          }
        }
      }

      router.navigate({
        pathname: "SearchResults",
        params: {
          title: "Choose " + (page == 2 ? "Another" : "Movie"),
          listings: listings,
          movies: moviesList,
          theatres: theatresList,
          id: id,
          theatreId: page == 1 ? id : theatreId,
          movieId: id,
          page: page + 1,
        },
        key: page + 1,
      });
    } else {
      goToDoubleFeatures(movieId, id);
    }
  };

  const goToDoubleFeatures = (localMovieId, secondMovieId) => {
    var dfs;
    if (theatreId == 0) {
      dfs = Util.findDoubleFeaturesInAllTheatres(
        localMovieId,
        secondMovieId,
        theatresList
      );
    } else {
      dfs = Util.findDoubleFeatures(
        theatreId,
        localMovieId,
        secondMovieId,
        theatresList
      );
    }
    router.navigate({
      pathname: "DoubleFeatures",
      params: {
        title: "Double Features",
        listings: listings,
        theatres: theatresList,
        theatreId: theatreId,
        firstMovieId: movieId,
        secondMovieId: secondMovieId,
        dfs: dfs,
      },
    });
  };

  const movieMode = () => {
    return page != 1;
  };

  const alert = () => {
    Alert.alert(
      "Try another one",
      "Some smaller theaters don't have enough screens to make a double feature happen. Them's the breaks."
    );
  };

  const renderRow = ({ item }) => {
    if (item == 0) {
      var placeholder = movieMode() ? "Search Movies" : "Search Theaters";
      return (
        <TextInput
          style={styles.searchInput}
          onChange={(event) => {
            onSearchTextChanged(event);
          }}
          placeholder={placeholder}
          placeholderTextColor={"#999"}
          autoCorrect={false}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          value={searchText}
        />
      );
    }
    var text, image;
    var greyedOut = false;
    if (noResults) {
      text = item;
      image = <View />;
    } else if (movieMode()) {
      text = listings.movies[item].name;
      image = <Poster movieId={item}></Poster>;
      if (theatreId != 0) {
        greyedOut =
          Util.findDoubleFeatureMovieIdsInTheatre(
            theatreId,
            item,
            listings.theatres
          ).size == 0;
      } else {
        greyedOut =
          Util.findDoubleFeatureMovieIdsInAllTheatres(item, listings.theatres)
            .size == 0;
      }
    } else {
      text = listings.theatres[item].name;
      image = <View />;
      greyedOut = !Util.checkTheatre(item, listings.theatres);
    }
    return (
      <TouchableHighlight
        onPress={() => rowPressed(greyedOut ? -1 : item)}
        underlayColor="#dddddd"
      >
        <View>
          <View style={styles.rowContainer}>
            {image}
            <View style={styles.titleContainer}>
              <Text
                style={greyedOut ? styles.greyedOut : styles.title}
                numberOfLines={page == 1 ? 1 : 3}
              >
                {text}
              </Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  };

  const onSearchTextChanged = (event) => {
    var results;
    if (movieMode()) {
      results = Object.keys(moviesList)
        .filter((id) =>
          moviesList[id].name
            .toLowerCase()
            .includes(event.nativeEvent.text.toLowerCase())
        )
        .sort((a, b) => moviesList[a].name.localeCompare(moviesList[b].name));
      setMoviesList(results);
      setSearchText(event.nativeEvent.text);
      setMovieSearchText(event.nativeEvent.text);
    } else {
      results = Object.keys(theatresList)
        .filter((id) =>
          theatresList[id].name
            .toLowerCase()
            .includes(event.nativeEvent.text.toLowerCase())
        )
        .sort((a, b) =>
          theatresList[a].ordinal > theatresList[b].ordinal ? 1 : -1
        );
      setTheatresList(results);
      setSearchText(event.nativeEvent.text);
      setTheatreSearchText(event.nativeEvent.text);
    }
    setNoResults(results.length < 1);
  };

  const renderHeader = () => {
    var headerText = "";
    if (page == 1) {
      headerText = "Let's get started! First, pick a theater.";
    } else if (page == 2) {
      if (theatreId == 0) {
        headerText = "Any theater, okay.";
      } else {
        headerText = listings.theatres[theatreId].name + ", okay.";
      }
      headerText += " Now pick a movie!";
    } else if (listings.movies[movieId]) {
      headerText =
        listings.movies[movieId].name +
        ", nice.  You can pick another one. Or not, whatever.";
    }
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>
    );
  };

  if (noResults) {
    dataSource = ["No results"];
  } else if (movieMode()) {
    var dataSource = moviesList;
  } else {
    var dataSource = theatresList;
  }
  dataSource = [0, ...dataSource];

  return (
    <>
      {renderHeader()}
      <View style={{ flex: 1, flexDirection: "column" }}>
        <FlatList
          data={dataSource}
          keyExtractor={(item) => `${item}`}
          renderItem={renderRow}
        />
        <View style={styles.dontCareContainer}>
          <TouchableHighlight
            style={styles.dontCare}
            onPress={() => rowPressed(0)}
          >
            <Text style={[styles.title, { color: "white" }]}>
              Any{" "}
              {page == 1 ? "Theater" : (page == 3 ? "Second " : "") + "Movie"}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    </>
  );
};

export default SearchResults;
