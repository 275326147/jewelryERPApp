/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Home from './js/entry';

import { StackNavigator } from 'react-navigation';

const App = StackNavigator({
  Home: { screen: Home }
});

export default class jewelryERPApp extends Component {
  render() {
    return (
      <Home />
    );
  }
};

AppRegistry.registerComponent('jewelryERPApp', () => jewelryERPApp);
