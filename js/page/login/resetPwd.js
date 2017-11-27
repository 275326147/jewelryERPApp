'use strict';
import React from 'react';
import PageComponent from '../PageComponent';
import { View, Image, Dimensions, Text, TouchableWithoutFeedback } from 'react-native';
import PasswordGesture from 'react-native-smart-gesture-password';
import Storage from '../../utils/storage';
import { forward, deleteAlias } from '../../utils/common';

const { width, height } = Dimensions.get('window');

export default class ResetPwd extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {
            isWarning: false,
            messageColor: '#fff',
            message: '请输入原手势密码'
        };
    }

    _onFinish = (password) => {
        Storage.getCurrentAccount(this, function (accountInfo) {
            if (!accountInfo.password) {
                //本地找不到对应手势密码，重新登录验证
                forward(this, 'Login');
                return;
            }
            if (password === accountInfo.password) {
                forward(this, 'SetPwd');
            } else {
                this.setState({
                    isWarning: true,
                    messageColor: 'red',
                    message: '密码错误，请重试'
                });
            }
        });
    }

    _onReset = () => {
        this.setState({
            isWarning: false,
            messageColor: '#fff',
            message: '请输入原手势密码'
        });
    }

    forgot() {
        Storage.getCurrentAccount(this, function (accountInfo) {
            accountInfo.token = '';
            accountInfo.password = '';
            Storage.setAccountInfo(this, accountInfo, function () {
                Storage.setStorageAsync('currentAccount', '');
                deleteAlias();
                forward(this, 'Login');
            });
        });
    }

    _renderDescription = () => {
        return (
            <View style={{ height: 40, paddingBottom: 30, justifyContent: 'flex-end', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: this.state.messageColor }}>
                    {this.state.message}
                </Text>
            </View>
        )
    }

    _renderActions = () => {
        return (
            <TouchableWithoutFeedback onPress={() => { this.forgot() }}>
                <View style={{ marginTop: 30, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 14 }}>忘记密码</Text>
                </View>
            </TouchableWithoutFeedback>
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