import React, { Component } from 'react';
import {
    Platform,
    BackHandler,
    ToastAndroid
} from 'react-native';
import JPushModule from 'jpush-react-native';
import JAnalyticsModule from 'janalytics-react-native';
import { forward } from '../utils/common';

let master = this;
let lastClickTime = 0;
let ignore = ['Start', 'Guide', 'CheckPwd', 'ResetPwd', 'SetPwd', 'Home', 'Login'];
export default class PageComponent extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'ios') {
            JAnalyticsModule.setup({ appKey: "802d48b9f065811226a4b54a" });
        }
    }

    componentDidMount(pageName) {
        master = this;
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.pageName = pageName;
        JAnalyticsModule.startLogPageView({ 'pageName': pageName || "" });
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

    componentWillUnmount() {
        JAnalyticsModule.stopLogPageView({ 'pageName': this.pageName || "" });
    }
}