/**
 * Created by Meiling.Zhou on 2017/9/29
 */
'use strict';

import { Alert } from 'react-native';
import { Common } from './common';
import Storage from './storage';

export function callServiceWithoutToken(master, url, params, successCallback, failCallback) {
    return fetch(Common.baseURL + url, {
        method: 'POST',
        headers: {},
        body: params
    }).then((response) => response.json()).then((responseJson) => {
        let code = responseJson.ret;
        let message = responseJson.msg;
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

export function callService(master, url, params, successCallback, failCallback) {
    try {
        Storage.getStorageAsync('userInfo').then((userInfo) => {
            if (userInfo === null || userInfo === '') {
                master.props.navigation.navigate('Login');
                return;
            }
            Storage.getStorageAsync('currentUser').then((currentUser) => {
                userInfo = JSON.parse(userInfo);
                if (currentUser === null || currentUser === '') {
                    let users = userInfo.users;
                    if (users && users.length > 0) {
                        currentUser = users[0];
                    }
                } else {
                    currentUser = JSON.parse(currentUser);
                }
                if (!params) params = new FormData();
                params.append("token", userInfo.token);
                params.append("userIndex", currentUser.index);
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
            });
        });
    } catch (e) {
        console.error(e);
        Alert.alert(
            '错误提示',
            '系统异常，请联系管理员处理',
            [
                { text: 'OK' }
            ],
            { cancelable: false }
        );
    }
}

export function handleResult(list) {
    if (list && list.length > 0) {
        let index = 1;
        list.forEach(function (item) {
            if (item && !item.key) {
                item.key = index++;
            }
        });
    }
    return list;
}