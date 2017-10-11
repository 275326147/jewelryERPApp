'use strict';
import React, { Component } from 'react';
import { View, Image, Dimensions, Text } from 'react-native';
import PasswordGesture from 'react-native-smart-gesture-password';
import Storage from '../../utils/storage';

const { width, height } = Dimensions.get('window');
let pwd = '';

export default class SetPwd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isWarning: false,
            messageColor: '#fff',
            message: '请设置手势密码'
        };
    }

    _onFinish = (password) => {
        if (pwd === '') {
            // The first password
            pwd = password;
            this.setState({
                isWarning: false,
                messageColor: '#fff',
                message: '请再次绘制手势密码'
            });
        } else {
            // The second password
            if (password === pwd) {
                this.setState({
                    isWarning: false,
                    messageColor: '#00AAEF',
                    message: '密码设置成功'
                });
                Storage.getStorageAsync('currentAccount').then((account) => {
                    Storage.setStorageAsync(account, pwd);
                }).catch((error) => {
                    console.log('系统异常' + error);
                });
                this.props.navigation.navigate('Home');
            } else {
                this.setState({
                    isWarning: true,
                    messageColor: 'red',
                    message: '两次手势密码不一致，请重试'
                });
            }
        }
    }

    _onReset = () => {
        if (pwd === '') {
            this.setState({
                isWarning: false,
                messageColor: '#fff',
                message: '请设置手势密码'
            });
        } else {
            this.setState({
                isWarning: false,
                messageColor: '#fff',
                message: '请再次绘制手势密码'
            });
        }
    }

    _renderDescription = () => {
        return (
            <View style={{ height: 30, paddingBottom: 10, justifyContent: 'flex-end', alignItems: 'center', }}>
                <Text style={{ fontSize: 18, color: this.state.messageColor }}>
                    {this.state.message}
                </Text>
            </View>
        )
    }

    _renderActions = () => {
        return (
            <View style={{ marginTop: 20, height: 40 }}></View>
        )
    }

    render() {
        return (
            <Image source={require('../../../assets/image/login/login.jpg')} style={{ height: height, width: width }} >
                <PasswordGesture
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingTop: 120 }}
                    gestureAreaLength={300}
                    isWarning={this.state.isWarning}
                    color={'#A9A9A9'}
                    activeColor={'#00AAEF'}
                    warningColor={'red'}
                    warningDuration={1500}
                    allowCross={false}
                    showArrow={false}
                    topComponent={this._renderDescription()}
                    bottomComponent={this._renderActions()}
                    onFinish={this._onFinish}
                    onReset={this._onReset}
                />
            </Image>
        );
    }
}