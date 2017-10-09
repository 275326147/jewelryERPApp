/**
 * Created by Meiling.Zhou on 2017/9/29
 */
'use strict';

import { Alert } from 'react-native';
import { Common } from './common';
import Storage from './storage';

export function callService(master, url, params, successCallback, failCallback) {
    Storage.getStorageAsync('userInfo').then((userInfo) => {
        let validateFlag = (url === 'getSmsValidateCode.do' || url === 'checkLogin.do');
        if (!validateFlag && (userInfo === null || userInfo === '')) {
            master.props.navigation.navigate('Login');
        } else {
            if (!params) params = new FormData();
            if (userInfo) params.append("token", JSON.parse(userInfo).token);
            return fetch(Common.baseURL + url, {
                method: 'POST',
                headers: {},
                body: params
            }).then((response) => response.json()).then((responseJson) => {
                let code = responseJson.ret;
                let message = responseJson.msg;
                if (code === -20) {
                    Alert.alert(
                        '提示',
                        '会话已过期，请重新登录',
                        [
                            { text: 'OK' }
                        ],
                        { cancelable: false }
                    );
                    Storage.setStorageAsync('currentAccount', '');
                    Storage.setStorageAsync('userInfo', '');
                    master.props.navigation.navigate('Login');
                    return;
                }
                if (code < 0) {
                    Alert.alert(
                        '错误提示',
                        message,
                        [
                            { text: 'OK' }
                        ],
                        { cancelable: false }
                    );
                    if (typeof failCallback === 'function') failCallback.call(master, responseJson);
                    return;
                }
                if (typeof successCallback === 'function') successCallback.call(master, responseJson);
            });
        }
    });
}