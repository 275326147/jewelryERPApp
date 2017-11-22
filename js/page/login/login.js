'use strict';
import React, { Component } from 'react';
import { Keyboard, View, TextInput, Text, Image, Dimensions, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Storage from '../../utils/storage';
import { callServiceWithoutToken } from '../../utils/service';
import { forward, setAlias } from '../../utils/common';

const { width, height } = Dimensions.get('window');

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: Platform.OS === 'android' ? '18682077880' : '18682077360',
            code: '',
            second: 60,
            enable: true,
            keyboardHeight: 280
        };
    }

    componentWillMount() {
        //监听键盘弹出事件
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',
            this.keyboardDidShowHandler.bind(this));
        //监听键盘隐藏事件
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',
            this.keyboardDidHideHandler.bind(this));
    }

    componentWillUnmount() {
        //卸载键盘弹出事件监听
        if (this.keyboardDidShowListener != null) {
            this.keyboardDidShowListener.remove();
        }
        //卸载键盘隐藏事件监听
        if (this.keyboardDidHideListener != null) {
            this.keyboardDidHideListener.remove();
        }
        if (this.timer != null) {
            clearInterval(this.timer);
        }
    }

    //键盘弹出事件响应
    keyboardDidShowHandler(event) {
        this.setState({
            keyboardHeight: (230 + event.endCoordinates.height)
        });
    }

    //键盘隐藏事件响应
    keyboardDidHideHandler(event) {
        this.setState({
            keyboardHeight: 280
        });
    }

    sendCode() {
        if (this.state.enable) {
            let params = new FormData();
            params.append("mobileNum", this.state.account);
            params.append("type", 1);
            callServiceWithoutToken(this, 'getSmsValidateCode.do', params, function (response) {
                this.setState({
                    code: response.msg
                });
            });
            this.timer && clearInterval(this.timer);
            this.timer = setInterval(() => {
                if (this.state.second > 0) {
                    this.setState({
                        enable: false,
                        second: (this.state.second - 1)
                    });
                } else {
                    this.setState({
                        second: 60,
                        enable: true
                    });
                    clearInterval(this.timer);
                }
            }, 1000);
        }
    }

    redirect() {
        let params = new FormData();
        params.append("mobileNo", this.state.account);
        params.append("smsValiCode", this.state.code);
        callServiceWithoutToken(this, 'checkLogin.do', params, function (response) {
            Storage.setStorageAsync('currentAccount', this.state.account).then(() => {
                setAlias();
            });
            Storage.setAccountInfo(this, response, function () {
                Storage.getCurrentAccount(this, function (accountInfo) {
                    if (!accountInfo.password) {
                        forward(this, 'SetPwd');
                    } else {
                        forward(this, 'CheckPwd');
                    }
                });
            });
        });
    }

    render() {
        return (
            <Image source={require('../../../assets/image/login/login.jpg')} style={{ height: height, width: width }} >
                <View style={[styles.container, { marginTop: (height - this.state.keyboardHeight) }]}>
                    <TextInput style={styles.input} placeholder='请输入您的手机号码'
                        onChangeText={(text) => {
                            if (this.state.account !== text) {
                                this.setState({
                                    account: text,
                                    second: 60,
                                    enable: true
                                });
                                clearInterval(this.timer);
                            }
                        }}
                        value={this.state.account}
                        underlineColorAndroid="transparent">
                    </TextInput>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.codeInput} placeholder='请输入验证码'
                            onChangeText={(text) => this.setState({ code: text })}
                            value={this.state.code}
                            underlineColorAndroid="transparent">
                        </TextInput>
                        {
                            this.state.enable ?
                                <TouchableOpacity
                                    style={styles.codeBtn}
                                    onPress={() => { this.sendCode() }}>
                                    <Text style={styles.codeText}>发送验证码</Text>
                                </TouchableOpacity>
                                :
                                <View style={styles.codeBtn}>
                                    <Text style={[styles.codeText, { color: '#999' }]}>重新发送({this.state.second})s</Text>
                                </View>
                        }
                    </View>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => { this.redirect() }}>
                        <Text style={styles.btnText}>登    录</Text>
                    </TouchableOpacity>
                </View>
            </Image>
        );
    }
}

const styles = StyleSheet.create({
    codeText: {
        fontSize: 13,
        color: '#333'
    },
    codeBtn: {
        borderLeftWidth: 1,
        borderColor: '#DCDCDC',
        flex: 1,
        height: 40,
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        height: 280,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    codeInput: {
        fontSize: 13,
        height: 40,
        flex: 2,
        backgroundColor: '#fff',
        padding: 0,
        paddingLeft: 10
    },
    inputContainer: {
        height: 40,
        flexDirection: 'row',
        width: Dimensions.get('window').width - 40,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10
    },
    input: {
        fontSize: 13,
        height: 40,
        width: Dimensions.get('window').width - 40,
        backgroundColor: '#fff',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        padding: 0,
        paddingLeft: 10
    },
    btn: {
        width: Dimensions.get('window').width - 40,
        height: 40,
        margin: 20,
        marginBottom: 30,
        backgroundColor: '#FEE892',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        fontSize: 16,
        color: '#7045D8'
    }
});