/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    Modal,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    DeviceEventEmitter,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import Storage from '../../utils/storage';
import { callService, handleResult } from '../../utils/service';

export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            changeUserVisible: false,
            userInfo: {},
            users: [],
            menuData: [
                { key: 2, text: '修改手势密码', handler: () => { this._onClose(); this.props.navigation.navigate('ResetPwd'); } },
                { key: 3, text: '关于软件', handler: () => { } }
            ]
        };
    }

    componentDidMount() {
        //注意addListener的key和emit的key保持一致
        this.msgListener = DeviceEventEmitter.addListener('showSettings', (listenerMsg) => {
            Storage.getStorageAsync('currentUser').then((currentUser) => {
                this.setState({
                    userInfo: JSON.parse(currentUser),
                    modalVisible: true
                });
            });
        });

        Storage.getStorageAsync('userInfo').then((userInfo) => {
            userInfo = JSON.parse(userInfo);
            if (userInfo && userInfo.users && userInfo.users.length > 1) {
                this.setState({
                    users: handleResult(userInfo.users),
                    menuData: [
                        { key: 1, text: '切换用户', handler: () => { this._changeUser(); } },
                        { key: 2, text: '修改手势密码', handler: () => { this._onClose(); this.props.navigation.navigate('ResetPwd'); } },
                        { key: 3, text: '关于软件', handler: () => { } }
                    ]
                });
            }
        });
    }

    componentWillUnmount() {
        //此生命周期内，去掉监听
        this.msgListener && this.msgListener.remove();
    }

    _renderItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={item.handler.bind(this)}>
            <View style={styles.menuContainer}>
                <Text style={styles.menuText}>{item.text}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    _onClose() {
        this.setState({ modalVisible: false });
    }

    _gotoUserInfo() {
        this._onClose();
        this.props.navigation.navigate('UserInfo');
    }

    _logout() {
        this._onClose();
        this.props.navigation.navigate('Login');
        callService(this, 'logout.do', new FormData(), function () {
            Storage.setStorageAsync('currentAccount', '');
            Storage.setStorageAsync('userInfo', '');
        });
    }

    _renderUserItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this._selectUser(item) }}>
            <View style={styles.menuContainer}>
                <Text style={styles.menuText}>{item.realName}</Text>
                <Text style={styles.menuText}>{item.companyName}</Text>
                <Text style={styles.menuText}>{item.shopName}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    _selectUser(user) {
        Storage.setStorageAsync('currentUser', JSON.stringify(user));
        this._onUserClose();
    }

    _changeUser() {
        this._onClose();
        this.setState({
            changeUserVisible: true
        });
    }

    _onUserClose() {
        this.setState({ changeUserVisible: false });
    }

    render() {
        return (
            <View>
                <Modal
                    visible={this.state.changeUserVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onUserClose()}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.modalContainer, { height: (this.state.users.length * 50) }]}>
                            <FlatList style={{ flex: 1 }} data={this.state.users} renderItem={this._renderUserItem} />
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.modalVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => { this._onClose() }}>
                    <View style={styles.container}>
                        <View style={styles.innerContainer}>
                            <View style={styles.headContainer}>
                                <TouchableWithoutFeedback onPress={() => { this._gotoUserInfo() }}>
                                    <Image style={styles.headImg} source={require('../../../assets/image/head/head.png')} />
                                </TouchableWithoutFeedback>
                                <View style={styles.userInfoContainer}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.nameText}>{this.state.userInfo.realName}</Text>
                                        <View style={styles.subNameContainer}>
                                            <Text style={styles.subNameText}>{this.state.userInfo.userRoleName}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.companyText}>{this.state.userInfo.companyName}</Text>
                                    <Text style={styles.companyText}>{this.state.userInfo.shopName}</Text>
                                </View>
                            </View>
                            <FlatList style={{ flex: 1 }} data={this.state.menuData} renderItem={this._renderItem} />
                            <TouchableOpacity style={styles.button} onPress={() => { this._logout() }}>
                                <Text style={styles.buttonText}>退出登录</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onPress={() => { this._onClose() }}>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#fff',
        width: (Dimensions.get('window').width - 60),
        borderRadius: 4
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    innerContainer: {
        width: 250,
        backgroundColor: '#fff',
        flexDirection: 'column'
    },
    headContainer: {
        margin: 10,
        marginTop: 60,
        marginBottom: 40,
        flexDirection: 'row'
    },
    headImg: {
        height: 80,
        width: 80
    },
    userInfoContainer: {
        marginTop: 10,
        marginLeft: 10
    },
    menuContainer: {
        flexDirection: 'row',
        height: 50,
        borderTopWidth: 1,
        borderBottomWidth: 0.5,
        borderColor: '#f3f3f1'
    },
    menuText: {
        margin: 15,
        marginRight: 10
    },
    button: {
        height: 36,
        width: 150,
        borderWidth: 1,
        borderColor: '#b5b5b5',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 35
    },
    buttonText: {
        textAlign: 'center'
    },
    nameText: {
        color: '#7B68EE',
        fontSize: 13,
        marginBottom: 5
    },
    companyText: {
        fontSize: 12,
        color: '#666',
        marginTop: 5
    },
    subNameContainer: {
        backgroundColor: '#EEEEE0',
        justifyContent: 'center',
        width: 36,
        height: 14,
        alignItems: 'center',
        borderRadius: 3,
        marginLeft: 8
    },
    subNameText: {
        color: 'black',
        fontSize: 9,
        textAlign: 'center'
    }
});