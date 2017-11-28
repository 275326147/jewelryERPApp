import React, { Component } from 'react';
import {
    BackHandler,
    ToastAndroid
} from 'react-native';
import JPushModule from 'jpush-react-native';
import { forward } from '../utils/common';

let master = this;
let lastClickTime = 0;
let ignore = ['Start', 'Guide', 'CheckPwd', 'ResetPwd', 'SetPwd', 'Home', 'Login'];
export default class PageComponent extends Component {
    componentDidMount() {
        master = this;
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        if (ignore.indexOf(master.props.navigation.state.routeName) > -1) {
            let now = new Date().getTime();
            if (now - lastClickTime < 2500) {//2.5秒内点击后退键两次推出应用程序
                return false;//控制权交给原生
            }
            lastClickTime = now;
            ToastAndroid.show('再按一次退出', ToastAndroid.SHORT);
            return true;
        }
        forward(master, master.backRoute);
        return true;
    }
}