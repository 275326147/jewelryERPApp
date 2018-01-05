/**
 * Created by Meiling.Zhou on 2017/9/29
 */
'use strict';
import { Constant, alert, forward, deleteAlias, unlockScreen } from './common';
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
            alert(this, 'error', '网络异常，请检查网络是否异常，如有疑问请联系管理员处理', () => {
                if (typeof failCallback === 'function') failCallback.call(master);
            });
        });
    } catch (e) {
        console.error(e);
        alert(this, 'error', '系统异常，请截屏联系管理员处理，异常信息：' + e, () => {
            if (typeof failCallback === 'function') failCallback.call(master);
        });
    }
}

export function callService(master, url, params, successCallback, failCallback) {
    try {
        let start = true;
        master.serviceTimeout = setTimeout(function () {
            master.serviceTimeout && clearTimeout(master.serviceTimeout);
            if (start) {
                master.setState({ loading: true });
            }
        }, 1000);
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
                start = false;
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
                } else if (code < 0) {
                    alert(this, 'error', message, () => {
                        if (typeof failCallback === 'function') failCallback.call(master, responseJson);
                    });
                } else if (typeof successCallback === 'function') {
                    successCallback.call(master, responseJson);
                }
                unlockScreen(master);
            }, (e) => {
                console.error(e);
                alert(this, 'error', '网络异常，请检查网络是否异常，如有疑问请联系管理员处理', () => {
                    unlockScreen(master);
                    if (typeof failCallback === 'function') failCallback.call(master);
                });
            });
        });
    } catch (e) {
        alert(this, 'error', '系统异常，请截屏联系管理员处理，异常信息：' + e, () => {
            unlockScreen(master);
            if (typeof failCallback === 'function') failCallback.call(master);
        });
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