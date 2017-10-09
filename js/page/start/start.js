'use strict';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Storage from '../../utils/storage';
import { Common } from '../../utils/common';

const splashImg = require('../../../assets/image/start/start.jpg');//加载图片

const { width, height } = Dimensions.get('window');

export default class Start extends Component {
    constructor(props) {
        super(props);
        this.state = {  //这是动画效果
            bounceValue: new Animated.Value(1)
        };
    }

    componentDidMount() {
        Animated.timing(
            this.state.bounceValue, { toValue: 1.2, duration: 1500 }
        ).start();
        this.timer = setTimeout(() => {
            Storage.getStorageAsync(Common.VERSION).then((result) => {
                if (result === null || result === '') {
                    //第一次启动 
                    this.props.navigation.navigate('Guide');
                    Storage.setStorageAsync(Common.VERSION, 'true');
                } else {
                    //第二次启动
                    Storage.getStorageAsync('currentAccount').then((account) => {
                        if (account === null || account === '') {
                            this.props.navigation.navigate('Login');
                        } else {
                            Storage.getStorageAsync(account).then((result) => {
                                if (result === null || result === '') {
                                    this.props.navigation.navigate('Login');
                                } else {
                                    this.props.navigation.navigate('CheckPwd');
                                }
                            }).catch((error) => {
                                console.log('系统异常' + error);
                            });
                        }
                    }).catch((error) => {
                        console.log('系统异常' + error);
                    });
                }
            }).catch((error) => {
                console.log('系统异常' + error);
            });
        }, 1000);
    }

    componentWillUpdate = () => {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <Animated.Image
                style={{
                    width: width,
                    height: height,
                    transform: [{ scale: this.state.bounceValue }]
                }}
                source={splashImg}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    }
});