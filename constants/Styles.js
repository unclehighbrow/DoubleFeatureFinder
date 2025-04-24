"use strict";

import React, { Component } from "react";
import { StyleSheet, Platform } from "react-native";

module.exports = StyleSheet.create({
  titleContainer: {
    flex: 2,
  },
  title: {
    fontSize: 20,
    color: "#656565",
  },
  greyedOut: {
    fontSize: 20,
    color: "#999999",
  },
  separator: {
    height: 1,
    backgroundColor: "#dddddd",
  },
  rowContainer: {
    flexDirection: "row",
    padding: 10,
  },
  row: {
    flexDirection: "row",
  },
  searchInput: {
    height: 35,
    padding: 5,
    paddingLeft: 12,
    marginRight: 12,
    marginLeft: 12,
    marginTop: 10,
    fontSize: 14,
    borderRadius: 5,
    color: "#656565",
    backgroundColor: Platform.OS === "ios" ? "#EEE" : "#FFF",
  },
  thumb: {
    width: 92,
    height: 138,
    marginRight: 5,
    marginLeft: 5,
  },
  thumbSmall: {
    width: 45,
    height: 68,
    marginRight: 5,
    marginLeft: 5,
  },
  dontCareContainer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    flex: 1,
  },
  dontCare: {
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "goldenrod",
    borderRadius: 20,
    alignSelf: "center",
  },
  header: {
    backgroundColor: "dodgerblue",
    padding: 20,
  },
  headerText: {
    color: "white",
    fontSize: 20,
  },
  sectionHeader: {
    backgroundColor: "dimgray",
    padding: 5,
  },
  sectionHeaderText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
  dfResultText: {
    fontSize: 17,
    color: "#656565",
  },
  hasLink: {
    color: "dodgerblue",
    textDecorationLine: "underline",
  },
  time: {
    fontSize: 14,
    color: "#656565",
    textAlign: "center",
  },
  timeSmall: {
    fontSize: 13,
    color: "#656565",
    textAlign: "center",
  },
});
