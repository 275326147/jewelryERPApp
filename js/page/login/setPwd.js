'use strict';
import React from 'react';
import PageComponent from '../PageComponent';
import { View, Image, Dimensions, Text } from 'react-native';
import PasswordGesture from 'react-native-smart-gesture-password';
import Storage from '../../utils/storage';
import { forward } from '../../utils/common';

const { width, height } = Dimensions.get('window');

export default class SetPwd extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {
            pwd: '',
            isWarning: false,
            messageColor: '#fff',
            message: '请设置手势密码'
        };
    }

    componentDidMount() {
        super.componentDidMount('重置手势密码');
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    _onFinish = (password) => {
        if (this.state.pwd === '') {
            // The first password
            this.setState({
                pwd: password,
                isWarning: false,
                messageColor: '#fff',
                message: '请再次绘制手势密码'
            });
        } else {
            // The second password
            if (password === this.state.pwd) {
                this.setState({
                    isWarning: false,
                    messageColor: '#00AAEF',
                    message: '密码设置成功'
                });
                Storage.setPassword(this, password);
                forward(this, 'Home');
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
        if (this.state.pwd === '') {
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
            <View style={{ height: 40, paddingBottom: 30, justifyContent: 'flex-end', alignItems: 'center', }}>
                <Text style={{ fontSize: 18, color: this.state.messageColor }}>
                    {this.state.message}
                </Text>
            </View>
        )
    }

    _renderActions = () => {
        return (
            <View style={{ marginTop: 30, height: 40 }}></View>
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