'use strict';
import React from 'react';
import PageComponent from '../PageComponent';
import { Keyboard, View, TextInput, Text, Image, Dimensions, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import JAnalyticsModule from 'janalytics-react-native';
import Storage from '../../utils/storage';
import { callServiceWithoutToken } from '../../utils/service';
import { forward, setAlias, alert } from '../../utils/common';

const { width, height } = Dimensions.get('window');

export default class Login extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            code: '',
            second: 60,
            enable: true,
            enableLogin: true,
            keyboardHeight: 280
        };
    }

    componentDidMount() {
        super.componentDidMount('登陆界面');
        //监听键盘弹出事件
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',
            this.keyboardDidShowHandler.bind(this));
        //监听键盘隐藏事件
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',
            this.keyboardDidHideHandler.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();
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
            let account = this.state.account;
            if (!/^1(3|4|5|7|8)\d{9}$/.test(account)) {
                alert(this, 'info', '请输入正确的手机号码');
                return;
            }
            this.refs.codeInput.focus();
            let params = new FormData();
            params.append("mobileNum", account);
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
        let account = this.state.account;
        let code = this.state.code;
        if (!/^1(3|4|5|7|8)\d{9}$/.test(account)) {
            alert(this, 'info', '请输入正确的手机号码');
            return;
        }
        if (!code || !code.trim()) {
            alert(this, 'info', '短信验证码不能为空');
            return;
        }
        let params = new FormData();
        params.append("mobileNo", account);
        params.append("smsValiCode", code);
        this.setState({
            enableLogin: false
        }, function () {
            callServiceWithoutToken(this, 'checkLogin.do', params, function (response) {
                this.setState({
                    enableLogin: true
                });
                Storage.setStorageAsync('currentAccount', account).then(() => {
                    setAlias();
                });
                var LoginEvent = {
                    type: 'login',
                    extra: {
                        userId: account
                    },
                    method: "login",
                    success: true
                };
                JAnalyticsModule.postEvent(LoginEvent);
                Storage.setAccountInfo(this, response, function () {
                    Storage.getCurrentAccount(this, function (accountInfo) {
                        if (!accountInfo.password) {
                            forward(this, 'SetPwd');
                        } else {
                            forward(this, 'CheckPwd');
                        }
                    });
                });
            }, function () {
                this.setState({
                    enableLogin: true
                });
            });
        });
    }

    render() {
        return (
            <Image source={require('../../../assets/image/login/login.jpg')} style={{ height: height, width: width }} >
                <View style={[styles.container, { marginTop: (height - this.state.keyboardHeight) }]}>
                    <TextInput style={styles.input} placeholder='请输入您的手机号码'
                        onChangeText={(text) => this.setState({ account: text })}
                        value={this.state.account}
                        underlineColorAndroid="transparent">
                    </TextInput>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.codeInput} placeholder='请输入验证码'
                            ref="codeInput"
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
                    {
                        this.state.enableLogin ?
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => { this.redirect() }}>
                                <Text style={styles.btnText}>登    录</Text>
                            </TouchableOpacity>
                            :
                            <View style={[styles.btn, { backgroundColor: '#EEEEEE' }]}>
                                <Text style={[styles.btnText, { color: '#999' }]}>登    录</Text>
                            </View>
                    }
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