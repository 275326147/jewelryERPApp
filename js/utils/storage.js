import {
    AsyncStorage
} from 'react-native';
import { forward, alert } from './common';

class Storage {
    /**
     * 异步保存
     */
    setStorageAsync(key, value) {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem(key, value, (error) => {
                if (error) {
                    console.log(`设置${key}失败${error}`);
                    reject(`设置${key}失败${error}`);
                } else {
                    console.log(`设置${key}成功`);
                    resolve(true);
                }
            });
        });
    }
    /**
     * 异步获取
     */
    getStorageAsync(key) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(key, (error, result) => {
                if (error) {
                    console.log(`读取${key}失败` + error);
                    reject(`读取${key}失败${error}`);
                } else {
                    console.log(`读取${key}成功`);
                    resolve(result);
                }
            });
        });

    }

    /**
     * 获取当前账号信息
     */
    getCurrentAccount(master, callback) {
        try {
            this.getStorageAsync('currentAccount').then((currentAccount) => {
                if (!currentAccount) {
                    forward(master, 'Login');
                    return;
                }
                this.getStorageAsync(currentAccount).then((accountInfo) => {
                    if (!accountInfo) {
                        forward(master, 'Login');
                        return;
                    }
                    accountInfo = JSON.parse(accountInfo);
                    if (!accountInfo.token) {
                        forward(master, 'Login');
                        return;
                    }
                    callback.call(master, accountInfo);
                });
            });
        } catch (error) {
            console.error(error);
            alert(this, 'error', '读取本地缓存失败，请确认APP是否有读写本地存储的权限');
        }
    }

    /**
     * 设置账号信息
     */
    setAccountInfo(master, value, callback) {
        try {
            this.getStorageAsync('currentAccount').then((currentAccount) => {
                this.getStorageAsync(currentAccount).then((accountInfo) => {
                    if (!accountInfo) {
                        accountInfo = {};
                    } else {
                        accountInfo = JSON.parse(accountInfo);
                    }
                    if (typeof value.password === "string") accountInfo.password = value.password;
                    accountInfo.token = value.token;
                    accountInfo.users = value.users;
                    if (value.currentUser) accountInfo.currentUser = value.currentUser;
                    if (!value.users || value.users.length === 0) {
                        alert(this, 'error', '用户列表为空，请联系管理员');
                        forward(master, 'Login');
                        return;
                    }
                    if (!accountInfo.currentUser) {
                        accountInfo.currentUser = value.users[0];
                    } else {
                        let flag = false;
                        let currentUser = accountInfo.currentUser;
                        value.users.forEach(function (item) {
                            if (currentUser.companyNo === item.companyNo && currentUser.userId === item.userId) {
                                accountInfo.currentUser = item;
                                flag = true;
                            }
                        });
                        if (!flag) accountInfo.currentUser = value.users[0];
                    }
                    this.setStorageAsync(currentAccount, JSON.stringify(accountInfo)).then(function () {
                        if (callback) {
                            callback.call(master);
                        }
                    });
                });
            });
        } catch (error) {
            console.error(error);
            alert(this, 'error', '读取本地缓存失败，请确认APP是否有读写本地存储的权限');
        }
    }

    /**
     * 设置手势密码
     */
    setPassword(master, password) {
        let self = this;
        this.getCurrentAccount(master, function (accountInfo) {
            self.getStorageAsync('currentAccount').then((account) => {
                accountInfo.password = password;
                self.setAccountInfo(master, accountInfo);
            }).catch((error) => {
                calert(this, 'error', '读取本地缓存失败，请确认APP是否有读写本地存储的权限');
            });
        });
    }
}
export default new Storage();