'use strict';
import React, { Component } from 'react';
import { View, Image, Dimensions } from 'react-native';
import PasswordGesture from 'react-native-gesture-password';
import Storage from '../../utils/storage';

const { width, height } = Dimensions.get('window');
let pwd = '';

export default class SetPwd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'normal',
            message: '请设置手势密码'
        };
    }

    onEnd(password) {
        if (pwd === '') {
            // The first password
            pwd = password;
            this.setState({
                status: 'normal',
                message: '请再次绘制手势密码'
            });
        } else {
            // The second password
            if (password === pwd) {
                Storage.getStorageAsync('currentAccount').then((account) => {
                    Storage.setStorageAsync(account, pwd);
                }).catch((error) => {
                    console.log('系统异常' + error);
                });
                this.props.navigation.navigate('Home');
            } else {
                this.setState({
                    status: 'wrong',
                    message: '两次手势密码不一致，请重试'
                });
            }
        }
    }

    onStart() {
        if (pwd === '') {
            this.setState({
                message: '请设置手势密码'
            });
        } else {
            this.setState({
                message: '请再次绘制手势密码'
            });
        }
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
                />
            </Image>
        );
    }
}