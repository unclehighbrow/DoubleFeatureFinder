'use strict';

import React, {
	Component,
} from 'react';

import ReactNative, {
	AppRegistry,
	StyleSheet,
	ListView,
	TouchableOpacity,
	Image,
	Text,
	View,
	TextInput,
	Animated,
	Linking,
} from 'react-native';
var styles = require('./Styles');
var images = {}; // global store for all images -- move to redux?

class Poster extends Component {
	constructor(props) {
		super(props);
		this.state = {
			url: ''
		}
		this._getImage = this._getImage.bind(this);
	}

	componentDidMount() {
		this._getImage();
	}

	_getImage() {
		if (images[this.props.movieId]) {
			this.setState({
				url: images[this.props.movieId]
			});
			return;
		}
		var api_key = 'b1339b127583d45241043e4a5d4d3d0a'
		var url = 'https://api.themoviedb.org/3/find/' + this.props.movieId.replace('3D', '') + '?external_source=imdb_id&api_key=' + api_key;
		fetch(url)
			.then(response => response.json())
			.then(json => {
				if (json.movie_results && json.movie_results.length > 0) {
					var poster_path = json.movie_results[0].poster_path;
					if (poster_path) {
						// other sizes: "w154", "w185", "w342"
						var url = 'http://image.tmdb.org/t/p/w154' + poster_path;
						this.setState({
							url
						});
						images[this.props.movieId] = url;
					}
				}
			})
			.catch(error => {});
	}

	render() {
		var source = (this.state.url) ? {
			uri: this.state.url
		} : null;
		return ( <Image style = {
				[(this.props.small ? styles.thumbSmall : styles.thumb), {
					backgroundColor: 'rgba(0,0,0,.1)'
				}, this.props.style]
			}
			source = {
				source
			}
			/>
		);
	}
}

module.exports = Poster;