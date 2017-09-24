'use strict';
import React, { Component } from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import PasswordGesture from 'react-native-gesture-password';

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
        if (password == '123') {
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
    }

    onStart() {
        this.setState({
            status: 'normal',
            message: '请输入手势密码'
        });
    }

    // Example for set password
    /*
    onEnd: function(password) {
        if ( Password1 === '' ) {
            // The first password
            Password1 = password;
            this.setState({
                status: 'normal',
                message: 'Please input your password secondly.'
            });
        } else {
            // The second password
            if ( password === Password1 ) {
                this.setState({
                    status: 'right',
                    message: 'Your password is set to ' + password
                });

                Password1 = '';
                // your codes to close this view
            } else {
                this.setState({
                    status: 'wrong',
                    message:  'Not the same, try again.'
                });
            }
        }
    },
    onStart: function() {
        if ( Password1 === '') {
            this.setState({
                message: 'Please input your password.'
            });
        } else {
            this.setState({
                message: 'Please input your password secondly.'
            });
        }
    },
    */

    getInitialState() {
        return {
            message: 'Please input your password.',
            status: 'normal'
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

const styles = StyleSheet.create({
    container: {
        height: 280,
        backgroundColor: 'transparent',
        marginTop: (height - 280),
        justifyContent: 'center',
        alignItems: 'center'
    }
});