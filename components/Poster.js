"use strict";

import React, { Component } from "react";
import { StyleSheet, Image, View } from "react-native";

import styles from "@/constants/Styles";
const emptyPoster = require("@/assets/images/emptyPoster.jpg");
const emptyPosterSmall = require("@/assets/images/emptyPosterSmall.jpg");
var images = {};

class Poster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieId: this.props.movieId,
    };
    this.getImage();
  }

  getImage() {
    return;
  }

  render() {
    this.getImage();
    if (images[this.props.movieId]) {
      return (
        <Image
          style={[
            this.props.small ? styles.thumbSmall : styles.thumb,
            this.props.style,
          ]}
          source={{ uri: images[this.props.movieId] }}
        />
      );
    } else {
      return (
        <Image
          style={[
            this.props.small ? styles.thumbSmall : styles.thumb,
            this.props.style,
          ]}
          source={this.props.small ? emptyPosterSmall : emptyPoster}
        />
      );
    }
  }
}

module.exports = Poster;
