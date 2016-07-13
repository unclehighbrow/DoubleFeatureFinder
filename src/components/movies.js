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


class Movies extends Component {

  static defaultProps = {
      theaters: {},
      selectedTheater: {}
  }

  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this._getMovieRowIdentities = this._getMovieRowIdentities.bind(this);
    var rowIdentities = this._getMovieRowIdentities(props.availableMovieIds, props.movies);
    this.state = {
      movieDataSource: this.ds.cloneWithRows(props.movies, rowIdentities)
    }
  }

  componentWillReceiveProps(nextProps) {
    var rowIdentities = this._getMovieRowIdentities(nextProps.availableMovieIds, nextProps.movies);
    this.setState({
      movieDataSource: this.ds.cloneWithRows(nextProps.movies, rowIdentities)
    })
  }

  _getMovieRowIdentities(availableMovieIds, movies) {
  	// sort movie ids
    var rowIdentities = availableMovieIds.sort((a,b) => movies[a].name.localeCompare(movies[b].name));
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
        	this.props.selectMovie(rowID);
        	this.props.navigator.push({
        		component: this.props.nextScene
        	})
        }}
        >
        <View style={fdn.chunk}>
          <Text style={[fdn.text]}>{rowData.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Movies;