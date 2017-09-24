'use strict';
import React, { Component } from 'react';
import { View, TextInput, Text, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

export default class Login extends Component {
    render() {
        return (
            <Image source={require('../../../assets/image/login/login.jpg')} style={{ height: height, width: width }} >
                <View style={styles.container}>
                    <TextInput style={styles.input} placeholder='   请输入您的手机号码'
                        underlineColorAndroid="transparent">
                    </TextInput>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.codeInput} placeholder='   请输入验证码'
                            underlineColorAndroid="transparent">
                        </TextInput>
                        <TouchableOpacity
                            style={styles.codeBtn}
                            onPress={() => { }}>
                            <Text style={styles.codeText}>发送验证码</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => { this.props.navigation.navigate('Password'); }}>
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
        marginTop: (height - 280),
        justifyContent: 'center',
        alignItems: 'center'
    },
    codeInput: {
        fontSize: 13,
        height: 40,
        flex: 2,
        backgroundColor: '#fff',
        padding: 0
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
        padding: 0
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