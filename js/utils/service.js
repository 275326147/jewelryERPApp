/**
 * Created by Meiling.Zhou on 2017/9/29
 */
'use strict';
import { Constant, alert, forward, deleteAlias } from './common';
import Storage from './storage';

export function callServiceWithoutToken(master, url, params, successCallback, failCallback) {
    try {
        if (!url.startsWith("http")) {
            url = Constant.baseURL + url;
        }
        return fetch(url, {
            method: 'POST',
            headers: {},
            body: params
        }).then((response) => {
            return response.json()
        }).then((responseJson) => {
            let code = responseJson.ret;
            let message = responseJson.msg;
            if (code < 0) {
                alert(this, 'error', message, () => {
                    if (typeof failCallback === 'function') failCallback.call(master, responseJson);
                });
                return;
            }
            if (typeof successCallback === 'function') successCallback.call(master, responseJson);
        }, (e) => {
            console.error(e);
            alert(this, 'error', '网络异常，请联系管理员');
        });
    } catch (e) {
        console.error(e);
        alert(this, 'error', '系统异常，请联系管理员处理');
    }
}

export function callService(master, url, params, successCallback, failCallback) {
    try {
        Storage.getCurrentAccount(master, function (accountInfo) {
            if (!params) params = new FormData();
            params.append("token", accountInfo.token);
            params.append("userIndex", accountInfo.currentUser.index);
            if (!url.startsWith("http")) {
                url = Constant.baseURL + url;
            }
            return fetch(url, {
                method: 'POST',
                headers: {},
                body: params
            }).then((response) => {
                return response.json();
            }).then((responseJson) => {
                let code = responseJson.ret;
                let message = responseJson.msg;
                if (code === -20) {
                    alert(this, 'info', '会话已过期，请重新登录', () => {
                        Storage.getCurrentAccount(master, function (accountInfo) {
                            accountInfo.token = '';
                            Storage.setAccountInfo(master, accountInfo, function () {
                                Storage.setStorageAsync('currentAccount', '');
                                deleteAlias();
                                forward(master, 'Login');
                            });
                        });
                    });
                    return;
                }
                if (code < 0) {
                    alert(this, 'error', message);
                    if (typeof failCallback === 'function') failCallback.call(master, responseJson);
                    return;
                }
                if (typeof successCallback === 'function') successCallback.call(master, responseJson);
            }, (e) => {
                console.error(e);
                alert(this, 'error', '系统异常，请联系管理员处理');
            });
        });
    } catch (e) {
        console.error(e);
        alert(this, 'error', '系统异常，请联系管理员处理');
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