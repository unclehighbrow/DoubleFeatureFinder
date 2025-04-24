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
  const { page, movieId, theatreId } = useLocalSearchParams();
  const pageNum = parseInt(page);

  const { listings } = useContext(ListingsContext);

  const [movieIdList, setMovieIdList] = React.useState(
    Object.keys(listings.movies).sort((a, b) =>
      listings.movies[a].name.localeCompare(listings.movies[b].name)
    )
  );
  const [theatreIdList, setTheatreIdList] = React.useState(
    Object.keys(listings.theatres).sort((a, b) =>
      listings.theatres[a].ordinal > listings.theatres[b].ordinal ? 1 : -1
    )
  );
  const [movieSearchText, setMovieSearchText] = React.useState("");
  const [theatreSearchText, setTheatreSearchText] = React.useState("");
  const [searchText, setSearchText] = React.useState("");
  const [noResults, setNoResults] = React.useState(false);

  useEffect(() => {
    if (pageNum === 2) {
      if (theatreId != 0) {
        setMovieIdList(Object.keys(listings.theatres[theatreId].m));
      }
    } else if (pageNum === 3) {
      let newMovieIdList;
      if (theatreId == 0) {
        newMovieIdList = Util.findDoubleFeatureMovieIdsInAllTheatres(
          movieId,
          listings.theatres
        );
      } else {
        newMovieIdList = Util.findDoubleFeatureMovieIdsInTheatre(
          theatreId,
          movieId,
          listings.theatres
        );
      }
      setMovieIdList(newMovieIdList);
    }
  }, [pageNum, theatreId]);

  const rowPressed = (id) => {
    // TODO: dimiss keyboard
    // dismissKeyboard();
    if (id == -1) {
      return alert();
    }
    if (pageNum === 3 || (pageNum === 2 && id == 0)) {
      goToDoubleFeatures(movieId, id);
    } else {
      router.navigate({
        pathname: "SearchResults",
        params: {
          listings: listings,
          theatreId: pageNum == 1 ? id : theatreId,
          movieId: pageNum == 2 ? id : movieId,
          page: pageNum + 1,
        },
        key: pageNum + 1,
      });
    }
  };

  const goToDoubleFeatures = (firstMovieId, secondMovieId) => {
    router.navigate({
      pathname: "DoubleFeatures",
      params: {
        title: "Double Features",
        listings,
        theatreId,
        firstMovieId,
        secondMovieId,
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
    if (item === 0) {
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
      results = Object.keys(movieIdList)
        .filter((id) =>
          movieIdList[id].name
            .toLowerCase()
            .includes(event.nativeEvent.text.toLowerCase())
        )
        .sort((a, b) => movieIdList[a].name.localeCompare(movieIdList[b].name));
      setMovieIdList(results);
      setSearchText(event.nativeEvent.text);
      setMovieSearchText(event.nativeEvent.text);
    } else {
      results = Object.keys(theatreIdList)
        .filter((id) =>
          theatreIdList[id].name
            .toLowerCase()
            .includes(event.nativeEvent.text.toLowerCase())
        )
        .sort((a, b) =>
          theatreIdList[a].ordinal > theatreIdList[b].ordinal ? 1 : -1
        );
      setTheatreIdList(results);
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
    } else {
      headerText = `Page: ${page}`;
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
    var dataSource = movieIdList;
  } else {
    var dataSource = theatreIdList;
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
