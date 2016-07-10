/* 
pick movie from selected theater(s) as part of your double feature
movie 1: don't care -> double features
movie 1: pick -> movie 2: pick or don't care -> double features
*/

'use strict';

import React, {
  Component,
} from 'react';

import ReactNative, {
  AppRegistry,
  StyleSheet,
  ListView,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Animated,
} from 'react-native';

import fdn from '../components/foundation';
import swatches from '../components/swatches';

import { connect } from 'react-redux'

class Movies extends Component {

  static defaultProps = {
      theaters: {}
  }

  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this._getMovieRowIdentities = this._getMovieRowIdentities.bind(this);
    var rowIdentities = this._getMovieRowIdentities(props.movies);
    this.state = {
      movieDataSource: this.ds.cloneWithRows(props.movies, rowIdentities)
    }
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    var rowIdentities = this._getMovieRowIdentities(nextProps.movies);
    this.setState({
      movieDataSource: this.ds.cloneWithRows(nextProps.movies, rowIdentities)
    })
  }

  _getMovieRowIdentities(movies) {
    var rowIdentities = Object.keys(movies).sort((a,b) => movies[a].name.localeCompare(movies[b].name));
    return rowIdentities;
  }

  render() {
    return(
      <View style={[fdn.container]}>
        <View style={[fdn.bounds]}>
          <View>
            <Text style={[fdn.text]}>Movies playing at</Text>
            <Text style={[fdn.text, fdn.textBold]}>{this.props.selectedTheater.name}</Text>
          </View>
          <ListView
            style={fdn.list}
            dataSource={this.state.movieDataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
            />
        </View>
      </View>
    )
  }

  _renderRow(rowData, sectionID, rowID){
    return(
      <TouchableOpacity 
        style={fdn.listItem}
        onPress={()=>{
          this.props.navigator.push({
            component: Movies
          })
        }}
        >
        <View style={fdn.chunk}>
          <Text>{rowData.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => {
  return {
    theaters: state.doubleFeatures.theaters,
    movies: state.doubleFeatures.movies,
    city: state.doubleFeatures.city,
  }
}

const mapDispatchToProps = {
  //fetchLocationFromCountryZip,
  //fetchCurrentPosition
}

export default connect(mapStateToProps, mapDispatchToProps)(Movies)