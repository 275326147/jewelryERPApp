/**
 * Created by Meiling.Zhou on 2017/9/29
 */
import { Alert } from 'react-native';

export const Constant = {
    VERSION: 'v1.0.0',
    baseURL: 'http://192.168.0.122/AppPLatform/mobileApi/'
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
    if (master.props.navigation.state.routeName !== url) {
        master.props.navigation.navigate(url, params);
    }
}

export function deepClone(obj) {
    var proto = Object.getPrototypeOf(obj);
    return Object.assign({}, Object.create(proto), obj);
}