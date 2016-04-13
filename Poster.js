'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  View,
  Component,
} = React;

var styles = require('./Styles');

class Poster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieId: this.props.movieId,
      imgSource: null
    }
    this.getImage();
  }

  getImage() {
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
              imgSource: 'http://image.tmdb.org/t/p/w92' + poster_path,
              movieId: this.props.movieId
            });
          }
        }
      })
      .catch(error => {});
  }

  render() {
    try {
      if (this.props.movieId != this.state.movieId) { // TODO: this causes a warning
        this.getImage();
      }
    } catch(e) {}
    return (
      <Image
        style={styles.thumb}
        source={{ uri: this.state.imgSource }}
      />
    );
  }
}

module.exports = Poster;
