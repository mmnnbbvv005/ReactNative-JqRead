/**
 * @format
 */
import React, { Component } from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {createStore} from 'redux';
import { Provider } from 'react-redux';
import reducers from './App/Redux/Reducers/index';
import {name as appName} from './app.json';

class ReduxDemo extends Component {
  render() {
    let store = createStore(reducers);
    return (
      <Provider store={store}>
        <App/>
      </Provider>
    );
  }
}
AppRegistry.registerComponent(appName, () => ReduxDemo);
