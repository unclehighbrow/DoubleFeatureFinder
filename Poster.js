'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Image,
  View,
  Component,
} = React;

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
    var url = 'https://api.themoviedb.org/3/find/' + this.state.movieId + '?external_source=imdb_id&api_key=' + api_key;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        var poster_path = json.movie_results[0].poster_path;
        if (poster_path) {
          // other sizes: "w154", "w185", "w342"
          this.setState({
            imgSource: 'http://image.tmdb.org/t/p/w92' + poster_path
          });
        }
      })
      .catch(error => {});
  }

  render() {
    return (
      <Image
        style={styles.thumb}
        source={{ uri: this.state.imgSource }}
      />
    );
  }
}

var styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  }
})

module.exports = Poster;
