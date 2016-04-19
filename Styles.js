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
    marginRight: 6,
    marginLeft: 6,
    paddingTop: 12,
  },
  sectionHeader: {
    backgroundColor: 'white'
  },
  searchInput: {
    height: 35,
    padding: 5,
    paddingLeft: 12,
    marginRight: 6,
    marginLeft: 6,
    marginTop: 10,
    fontSize: 12,
    borderWidth: 1,
    borderRadius: 16,
    color: 'gray'
  },
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  showtimes: {
    fontSize: 20,
    color: 'dodgerblue',
  },
  theShowtime: {
    fontSize: 20,
    fontWeight: '500'
  },
  row: {
    flexDirection: 'row'
  },
  timeLeft: {
    flex: 1
  },
  titleRight: {
    flex: 2
  },
  button: {
    height: 40,
    alignSelf: 'center',
    width: 70,
    backgroundColor: 'dodgerblue',
    borderColor: 'dodgerblue',
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 30,
    marginRight: 30,
    justifyContent: 'center',
    flex: 1
  },
  buttonText: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'center'
  },
  notSelectedButton: {
    backgroundColor: '#EEEEEE'
  },
  notSelectedText: {
    color: 'dodgerblue'
  },
  left: {
    flex: 1
  },
  center: {
    flex: 3,
    textAlign: 'center'
  },
  right: {
    textAlign: 'right',
    flex: 1
  }
});
