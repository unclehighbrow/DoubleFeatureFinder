"use strict";

import React, { Component, useContext } from "react";
import { StyleSheet, Image, View } from "react-native";
import { ListingsContext } from "@/constants/Context";

import styles from "@/constants/Styles";
const emptyPoster = require("@/assets/images/emptyPoster.jpg");

const Poster = ({ movieId, small, style }) => {
  const { listings } = useContext(ListingsContext);
  const image = { uri: listings.movies[movieId].image } || emptyPoster;
  return (
    <Image
      style={[small ? styles.thumbSmall : styles.thumb, style]}
      source={image}
    />
  );
};

export default Poster;
