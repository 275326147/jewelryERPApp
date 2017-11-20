/**
 * Created by Meiling.Zhou on 2017/9/29
 */
import { Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';

export const Constant = {
    VERSION: 'v1.0.0',
    baseURL: 'http://192.168.0.122/AppPLatform/mobileApi/' //192.168.0.122  120.76.55.67:7777
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
        })
        navigation.dispatch(resetAction)
    }
}

export function deepClone(obj) {
    var proto = Object.getPrototypeOf(obj);
    return Object.assign({}, Object.create(proto), obj);
}