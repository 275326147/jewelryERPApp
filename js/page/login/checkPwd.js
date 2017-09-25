'use strict';
import React, { Component } from 'react';
import { View, Image, Dimensions, Text, TouchableWithoutFeedback } from 'react-native';
import PasswordGesture from 'react-native-gesture-password';
import Storage from '../../utils/storage';

const { width, height } = Dimensions.get('window');

export default class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'normal',
            message: '请输入手势密码'
        };
    }

    onEnd(password) {
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
                        status: 'right',
                        message: '密码验证成功'
                    });
                    this.props.navigation.navigate('Home');
                } else {
                    this.setState({
                        status: 'wrong',
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

    onStart() {
        this.setState({
            status: 'normal',
            message: '请输入手势密码'
        });
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
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    status={this.state.status}
                    message={this.state.message}
                    onStart={() => this.onStart()}
                    onEnd={(password) => this.onEnd(password)}
                >
                    <TouchableWithoutFeedback onPress={() => { this.forgot() }}>
                        <View style={{ marginTop: (height - 40), marginBottom: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 14, }}>忘记密码</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </PasswordGesture>
            </Image>
        );
    }
}