'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  titleContainer: {
    flex: 2
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
  row: {
    flexDirection: 'row'
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
    color: '#656565',
    backgroundColor: '#EEE',
  },
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  dontCareContainer: {
    position: 'absolute',
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
    backgroundColor: 'goldenrod',
    borderRadius: 20,
    alignSelf: 'center',
  },
  header: {
    backgroundColor: 'dodgerblue',
    padding: 20,
  },
  headerText: {
    color:'white',
    fontSize: 20,
  }
});
