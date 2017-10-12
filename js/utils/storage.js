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
        this.getStorageAsync('currentAccount').then((currentAccount) => {
            if (!currentAccount) {
                forward(master, 'Login');
                return;
            }
            this.getStorageAsync(currentAccount).then((accountInfo) => {
                if (!accountInfo || !accountInfo.token) {
                    forward(master, 'Login');
                    return;
                }
                accountInfo = JSON.parse(accountInfo);
                callback.call(master, accountInfo);
            }).catch((error) => {
                alert(this, 'error', '读取本地缓存失败，请确认APP是否有读写本地存储的权限');
            });
        }).catch((error) => {
            alert(this, 'error', '读取本地缓存失败，请确认APP是否有读写本地存储的权限');
        });
    }

    /**
     * 设置账号信息
     */
    setAccountInfo(master, value) {
        this.getStorageAsync('currentAccount').then((currentAccount) => {
            let info = {};
            info.token = value.token;
            info.users = value.users;
            info.currentUser = value.currentUser
            if (!value.users || value.users.length === 0) {
                alert(this, 'error', '用户列表为空，请联系管理员');
                forward(master, 'Login');
                return;
            }
            if (!info.currentUser) info.currentUser = value.users[0];
            this.getStorageAsync(currentAccount).then((accountInfo) => {
                if (accountInfo) {
                    accountInfo = JSON.parse(accountInfo);
                    let currentUser = accountInfo.currentUser;
                    if (currentUser) {
                        let flag = false;
                        value.users.forEach(function (item) {
                            if (currentUser.companyNo === item.companyNo && currentUser.userId === item.userId) {
                                info.currentUser = item;
                                flag = true;
                            }
                        });
                        if (!flag) info.currentUser = value.users[0];
                    }
                }
                this.setStorageAsync(currentAccount, JSON.stringify(info)).catch((error) => {
                    alert(this, 'error', '设置本地缓存失败，请确认APP是否有读写本地存储的权限');
                });
            }).catch((error) => {
                alert(this, 'error', '读取本地缓存失败，请确认APP是否有读写本地存储的权限');
            });
        }).catch((error) => {
            alert(this, 'error', '读取本地缓存失败，请确认APP是否有读写本地存储的权限');
        });
    }

    /**
     * 设置手势密码
     */
    setPassword(master, password) {
        let self = this;
        this.getCurrentAccount(master, function (accountInfo) {
            self.getStorageAsync('currentAccount').then((account) => {
                accountInfo.password = password;
                self.setAccountInfo(account, accountInfo);
            }).catch((error) => {
                calert(this, 'error', '读取本地缓存失败，请确认APP是否有读写本地存储的权限');
            });
        });
    }
}
export default new Storage();