'use strict';
import React, { Component } from 'react';
import { View, Image, Dimensions, Text, TouchableWithoutFeedback } from 'react-native';
import PasswordGesture from 'react-native-smart-gesture-password';
import Storage from '../../utils/storage';

const { width, height } = Dimensions.get('window');

export default class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isWarning: false,
            messageColor: '#fff',
            message: '请输入手势密码'
        };
    }

    _onFinish = (password) => {
        Storage.getStorageAsync('currentAccount').then((account) => {
            if (account == null || account == '') {
                //本地找不到当前登录账号，重新登录验证
                this.props.navigation.navigate('Login');
                return;
            }
            Storage.getStorageAsync(account).then((result) => {
                if (result == null || result == '') {
                    //本地找不到对应手势密码，重新登录验证
                    this.props.navigation.navigate('Login');
                    return;
                }
                if (password === result) {
                    this.setState({
                        isWarning: false,
                        messageColor: '#00AAEF',
                        message: '密码验证成功'
                    });
                    this.props.navigation.navigate('Home');
                } else {
                    this.setState({
                        isWarning: true,
                        messageColor: 'red',
                        message: '密码错误，请重试'
                    });
                }
            }).catch((error) => {
                console.log('系统异常' + error);
            });
        }).catch((error) => {
            console.log('系统异常' + error);
        });
    }

    _onReset = () => {
        this.setState({
            isWarning: false,
            message: '请输入手势密码',
            messageColor: '#fff'
        });
    }

    _renderDescription = () => {
        return (
            <View style={{ height: 30, paddingBottom: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: this.state.messageColor }}>
                    {this.state.message}
                </Text>
            </View>
        )
    }

    _renderActions = () => {
        return (
            <TouchableWithoutFeedback onPress={() => { this.forgot() }}>
                <View style={{ marginTop: 20, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 14 }}>忘记密码</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }


    forgot() {
        Storage.getStorageAsync('currentAccount').then((result) => {
            Storage.setStorageAsync(result, '');
            Storage.setStorageAsync('currentAccount', '');
        }).catch((error) => {
            console.log('系统异常' + error);
        });
        this.props.navigation.navigate('Login');
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