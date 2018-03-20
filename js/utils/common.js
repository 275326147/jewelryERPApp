/**
 * Created by Meiling.Zhou on 2017/9/29
 */
import { Alert, NativeAppEventEmitter, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import JPushModule from 'jpush-react-native';
import Storage from './storage';

export const Constant = {
    VERSION: Platform.OS === 'ios' ? 'v1.0.2' : 'v1.0.2',
    BUILD: Platform.OS === 'ios' ? 2 : 2,
    baseURL: 'http://app.zberp.net:7777/AppPLatform/mobileApi/'//192.168.0.122  120.76.55.67:7777 app.zberp.net:7777 http://app.zberp.net:7777/AppPLatform/mobileApi/
}

export function alert(master, type, message, okCallback, cancelCallback) {
    let actions = [{
        text: '确定', onPress: () => {
            if (okCallback) okCallback.call(master);
        }
    }];
    if (cancelCallback) {
        actions.push({
            text: '取消', onPress: () => {
                cancelCallback.call(master);
            }
        });
    }
    let title = '提示';
    if (type === 'error') {
        title = '错误提示';
    } else if (type === 'info') {
        title = '提示';
    } else if (type) {
        title = type;
    }
    if (master.state.loading) {
        master.alertTimeout = setTimeout(() => {
            master.alertTimeout && clearTimeout(master.alertTimeout);
            Alert.alert(
                title,
                message,
                actions,
                { cancelable: false }
            );
        }, 1000);
        return;
    }
    Alert.alert(
        title,
        message,
        actions,
        { cancelable: false }
    );
}

export function forward(master, url, params) {
    let navigation = master.props ? master.props.navigation : master;
    if (navigation.state.routeName !== url) {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: url, params: params })
            ]
        });
        navigation.dispatch(resetAction)
    }
}

export function deepClone(obj) {
    var proto = Object.getPrototypeOf(obj);
    return Object.assign({}, Object.create(proto), obj);
}

export function setAlias() {
    Storage.getStorageAsync('currentAccount').then((currentAccount) => {
        if (currentAccount) {
            JPushModule.setAlias(currentAccount, () => {
                if (Platform.OS === 'ios') {
                    NativeAppEventEmitter.removeAllListeners();
                    NativeAppEventEmitter.addListener('ReceiveNotification', (message) => {
                        JPushModule.setBadge(0, function () { });
                    });
                } else {
                    //---------------------------------android start---------------------------------
                    JPushModule.removeReceiveOpenNotificationListener();
                    JPushModule.notifyJSDidLoad((resultCode) => { });
                    JPushModule.addReceiveOpenNotificationListener((map) => {
                        JPushModule.jumpToPushActivity("jewelryERPApp");
                    });
                    //---------------------------------android end---------------------------------
                }
            });
        }
    });
}

export function deleteAlias() {
    JPushModule.getAlias((alias) => {
        if (alias) {
            JPushModule.deleteAlias((args) => { });
        }
    });
}

export function unlockScreen(master) {
    master.lockTimeout = setTimeout(function () {
        master.setState({
            loading: false
        });
        master.lockTimeout && clearTimeout(master.lockTimeout);
    }, 500);
}