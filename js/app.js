/**
 * Created by Meiling.Zhou on 2017/9/10
 */

'use strict';
import React from 'react';
import { Navigator } from 'react-native-deprecated-custom-components';
import { BackHandler } from 'react-native';

import Route from './route/route';
import NavigationBarMap from './route/navigationBar';
import goBack from './route/goBack';
import SceneConfigs from './route/sceneConfigs';

export default class JewelryERPApp extends React.Component {

    constructor(props) {
        super(props);
        // this.route = null;
        this.navigator = null;
        //
        BackHandler.addEventListener('hardwareBackPress', () => {
            return goBack(this.navigator);
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress');
    }

    /**
     * 每 navigation 入栈时，就会调用此方法
     * 加载配置好的路由指定页面
     * @param {any} route
     * @param {any} navigator
     * @returns
     */
    _renderRoute(route, navigator) {
        // this.route = route;
        this.navigator = navigator;
        return Route.getRoutePage(route, navigator);
    }

    render() {
        return (
            //navigator 总控入口
            <Navigator
                initialRoute={{
                    id: 'home',
                    params: {}
                }}
                // initialRouteStack={Route}
                renderScene={this._renderRoute.bind(this)}
                configureScene={(route, routeStack) =>
                    SceneConfigs.PushFromRight
                    // Navigator.SceneConfigs.PushFromRight
                }
            />
        );
    }

}