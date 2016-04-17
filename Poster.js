'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  View,
  Component,
} = React;

var styles = require('./Styles');
var images = {};

class Poster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieId: this.props.movieId
    }
    this.getImage();
  }

  getImage() {
     if (images[this.props.movieId]) {
       return;
     }
    var api_key = 'b1339b127583d45241043e4a5d4d3d0a'
    var url = 'https://api.themoviedb.org/3/find/' + this.props.movieId + '?external_source=imdb_id&api_key=' + api_key;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.movie_results && json.movie_results.length > 0) {
          var poster_path = json.movie_results[0].poster_path;
          if (poster_path) {
            // other sizes: "w154", "w185", "w342"
            this.setState({
              movieId: this.props.movieId
            });
            images[this.props.movieId] = 'http://image.tmdb.org/t/p/w92' + poster_path;
          }
        }
      })
      .catch(error => {});
  }

  render() {
    this.getImage();
    return (
      <Image
        style={styles.thumb}
        source={{ uri: images[this.props.movieId] }}
      />
    );
  }
}

module.exports = Poster;
