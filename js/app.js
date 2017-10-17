/**
 * Created by Meiling.Zhou on 2017/9/10
 */

'use strict';
import React from 'react';
import Route from './route/route';
import JPushModule from 'jpush-react-native';
import { Platform, BackHandler } from 'react-native';

export default class JewelryERPApp extends React.Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', function () {
            this.exitApp();
            return false;
        });
        if (Platform.OS === 'android') {
            // 在收到点击事件之前调用此接口
            JPushModule.notifyJSDidLoad((resultCode) => { });

            JPushModule.addReceiveNotificationListener((map) => {
                console.log("alertContent: " + map.alertContent);
                console.log("extras: " + map.extras);
                // var extra = JSON.parse(map.extras);
                // console.log(extra.key + ": " + extra.value);
            });

            JPushModule.addReceiveOpenNotificationListener((map) => {
                console.log("Opening notification!");
                console.log("map.extra: " + map.key);
                JPushModule.jumpToPushActivity("jewelryERPApp");
            });

            JPushModule.addGetRegistrationIdListener((registrationId) => {
                console.log("Device register succeed, registrationId " + registrationId);
            });
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress');
    }

    render() {
        return (
            <Route />
        );
    }
}