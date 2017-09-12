/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    Platform,
    View,
    Image,
    Text,
    StyleSheet,
    Alert,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';

export default class Head extends Component {

    showSettings() {
        DeviceEventEmitter.emit('showSettings','显示设置界面');
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => this.showSettings()}>
                    <Image style={styles.img} source={require('../assets/image/head/user.png')} />
                </TouchableWithoutFeedback>
                <Text style={styles.txt}>首页</Text>
                <Image style={styles.img} source={require('../assets/image/head/camera.png')} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'android' ? 0 : 15,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        height: 25,
        width: 25,
        marginLeft: 20,
        marginRight: 20
    },
    txt: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#333333'
    }
});