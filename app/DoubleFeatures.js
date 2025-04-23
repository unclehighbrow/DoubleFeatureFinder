"use strict";

import React, { Component, useEffect } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  SectionList,
  Linking,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import Util from "@/constants/Util";
import styles from "@/constants/Styles";
import Poster from "@/components/Poster";

const DoubleFeatures = () => {
  const { listings, dfs } = useLocalSearchParams();
  const [small, setSmall] = React.useState(false);

  useEffect(() => {
    const dimensions = Dimensions.get("window");
    setSmall(dimensions.width < 350);
  }, []);
  const imageHeight = () => (small ? 140 : 180);

  const data = []; // [{data: [[theatreId, movieId1, time1, movieId2, time2]], key: theatreId}]
  const sections = []; // [theatreId]
  dfs.map((df) => {
    const section = df[0];
    if (sections.indexOf(section) === -1) {
      // if there's no section yet, make one
      sections.push(section);
      data.push({ data: [], key: section });
    }
    data.forEach((theatre) => {
      // now find the right section, maybe the one we just put in, and stick it in
      if (theatre.key === df[0]) {
        // dups get in somehow, and this fixes it
        if (
          theatre.data.find((eDf) => {
            return (
              eDf[1] === df[1] &&
              eDf[2] === df[2] &&
              eDf[3] === df[3] &&
              eDf[4] === df[4]
            );
          }) == null
        ) {
          theatre.data.push(df);
        }
      }
    });
  });

  data.sort((a, b) =>
    this.theatres[a.key].ordinal > this.theatres[b.key].ordinal ? 1 : -1
  );

  data.forEach((theatre) => {
    theatre.data.sort((a, b) => (parseInt(a[2]) > parseInt(b[2]) ? 1 : -1));
  });

  const rowPressed = (link) => {
    if (link != "") {
      Linking.openURL(link);
    }
  };

  const renderRow = ({ item }) => {
    const sectionId = item[0];
    const rowData = item;
    var firstLink =
      listings.theatres[sectionId]["m"][rowData[1]][rowData[2]]["l"];
    var secondLink =
      listings.theatres[sectionId]["m"][rowData[3]][rowData[4]]["l"];
    var timeStyle = small ? styles.timeSmall : styles.time;
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, padding: 5, height: imageHeight() }}>
          <Poster
            movieId={rowData[3]}
            small={small}
            style={{ position: "absolute", top: 35, left: 35 }}
          />
          <Poster
            movieId={rowData[1]}
            small={small}
            style={{ position: "absolute", top: 5, left: 5 }}
          />
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            height: imageHeight(),
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1, padding: 5, marginTop: 25, marginLeft: 5 }}>
            <TouchableHighlight
              style={{ height: imageHeight() / 2, flex: 1 }}
              onPress={() => rowPressed(firstLink)}
              underlayColor="white"
            >
              <View>
                <Text
                  style={[
                    timeStyle,
                    { fontWeight: "bold" },
                    firstLink != "" ? styles.hasLink : {},
                  ]}
                >
                  {Util.minsToTime(parseInt(rowData[2]))}
                </Text>
                <Text
                  style={[timeStyle, { fontSize: 10, textAlign: "center" }]}
                >
                  to
                </Text>
                <Text style={timeStyle}>
                  {Util.minsToTime(
                    parseInt(rowData[2]) +
                      parseInt(listings.movies[rowData[1]].duration)
                  )}
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ height: imageHeight() / 2, flex: 1 }}
              onPress={() => rowPressed(secondLink)}
              underlayColor="white"
            >
              <View>
                <Text
                  style={[
                    timeStyle,
                    { fontWeight: "bold" },
                    firstLink != "" ? styles.hasLink : {},
                  ]}
                >
                  {Util.minsToTime(parseInt(rowData[4]))}
                </Text>
                <Text
                  style={[timeStyle, { fontSize: 10, textAlign: "center" }]}
                >
                  to
                </Text>
                <Text style={timeStyle}>
                  {Util.minsToTime(
                    parseInt(rowData[4]) +
                      parseInt(this.listings.movies[rowData[3]].duration)
                  )}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          <View
            style={{
              flex: 2,
              flexDirection: "column",
              padding: 5,
              marginTop: 20,
            }}
          >
            <TouchableHighlight
              style={{ height: imageHeight() / 2 }}
              onPress={() => rowPressed(firstLink)}
              underlayColor="white"
            >
              <Text style={[styles.dfResultText, {}]} numberOfLines={3}>
                {listings.movies[rowData[1]]["name"]}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ height: imageHeight() / 2 }}
              onPress={() => rowPressed(secondLink)}
              underlayColor="white"
            >
              <Text style={[styles.dfResultText, {}]} numberOfLines={3}>
                {listings.movies[rowData[3]]["name"]}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Here are your double features. Enjoy your day at the movies!
        </Text>
      </View>
    );
  };

  const renderSectionHeader = ({ section }) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>
          {listings.theatres[section.key]["name"]}
        </Text>
      </View>
    );
  };

  const renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => {
    return <View style={styles.separator}></View>;
  };

  return (
    <>
      {renderHeader()}
      <SectionList
        keyExtractor={(item) => {
          return `${item[0]}-${item[1]}-${item[2]}-${item[3]}-${item[4]}`;
        }}
        renderItem={renderRow}
        renderSectionHeader={renderSectionHeader}
        sections={data}
      />
    </>
  );
};

export default DoubleFeatures;
