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

    constructor(props) {
        super(props);
    }

    showSettings() {
        DeviceEventEmitter.emit('showSettings', '显示设置界面');
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => this.showSettings()}>
                    <Image style={styles.img} source={require('../../../assets/image/head/user.png')} />
                </TouchableWithoutFeedback>
                <Text style={styles.txt}>{this.props.title}</Text>
                <Image style={styles.img} source={require('../../../assets/image/head/camera.png')} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'android' ? 0 : 15,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    img: {
        height: 20,
        width: 20,
        marginLeft: 20,
        marginRight: 20
    },
    txt: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333333'
    }
});