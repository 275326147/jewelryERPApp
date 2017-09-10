/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import Navigator from './js/entry';

export default class jewelryERPApp extends Component {
  render() {
    return (
      <Navigator />
    );
  }
};

AppRegistry.registerComponent('jewelryERPApp', () => jewelryERPApp);
