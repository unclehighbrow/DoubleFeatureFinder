'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  textContainer: {
    flex: 2
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
  sectionHeaderContainer: {
    marginRight: 12,
    marginLeft: 12,
    paddingTop: 12,
  },
  sectionHeader: {
    backgroundColor: 'white'
  },
  searchInput: {
    height: 35,
    padding: 5,
    marginRight: 12,
    marginLeft: 12,
    marginTop: 10,
    fontSize: 12,
    borderWidth: 1,
    borderRadius: 12,
    color: 'gray'
  },
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  }
});
