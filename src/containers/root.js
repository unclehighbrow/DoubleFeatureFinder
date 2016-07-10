'use strict';

import React, {
  Component,
} from 'react';

import ReactNative, {
  AppRegistry,
} from 'react-native';

import { Provider } from 'react-redux';
import configureStore from "../store/configure-store";

const store = configureStore();

import App from "../components/app.js";


class Root extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<App />
			</Provider>
	    );
  	}
}

export default Root;
