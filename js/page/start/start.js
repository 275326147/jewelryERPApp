'use strict';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, AppState } from 'react-native';
import Storage from '../../utils/storage';
import { Constant, alert, forward, setAlias } from '../../utils/common';

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
        setAlias();
        //监听状态改变事件
        AppState.addEventListener('change', (state) => {
            if (state === 'background') {
                this.leaveTime = new Date();
            } else if (state === 'active' && this.leaveTime) {
                let now = new Date();
                let time = now.getTime() - this.leaveTime.getTime();
                this.leaveTime = null;
                if (time > 30 * 60 * 1000) {
                    this.props.navigation.navigate('CheckPwd', { back: true });
                }
            }
        });
        Animated.timing(
            this.state.bounceValue, { toValue: 1.2, duration: 1500 }
        ).start();
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            Storage.getStorageAsync(Constant.VERSION).then((result) => {
                if (!result) {
                    //第一次启动                     
                    Storage.setStorageAsync(Constant.VERSION, 'true');
                    forward(this, 'Guide');
                    return;
                }
                //第二次启动
                Storage.getCurrentAccount(this, function (accountInfo) {
                    if (accountInfo.password) {
                        forward(this, 'CheckPwd');
                    } else {
                        forward(this, 'SetPwd');
                    }
                });
            }).catch((error) => {
                console.log('系统异常' + error);
            });
        }, 1000);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View>
                <Animated.Image
                    style={{
                        width: width,
                        height: height,
                        transform: [{ scale: this.state.bounceValue }]
                    }}
                    source={splashImg}
                />
            </View>
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