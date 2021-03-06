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
    Dimensions,
    Linking,
    NativeModules
} from 'react-native';
import Storage from '../../utils/storage';
import { callService, handleResult } from '../../utils/service';
import { forward, deleteAlias, Constant } from '../../utils/common';

export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detailVisible: false,
            modalVisible: false,
            changeUserVisible: false,
            userInfo: {},
            users: [],
            menuData: [
                { key: 2, text: '修改手势密码', handler: () => { this._onClose(); forward(this, 'ResetPwd'); } },
                { key: 3, text: '关于软件', handler: () => { this.setState({ modalVisible: false, detailVisible: true }); } }
            ]
        };
    }

    componentDidMount() {
        this.msgListener = DeviceEventEmitter.addListener('showSettings', (listenerMsg) => {
            this.setState({
                modalVisible: true
            });
            Storage.getCurrentAccount(this, function (accountInfo) {
                this.setState({
                    userInfo: accountInfo.currentUser
                });
                if (accountInfo.users.length > 1) {
                    this.setState({
                        users: handleResult(accountInfo.users),
                        menuData: [
                            { key: 1, text: '切换用户', handler: () => { this._changeUser(); } },
                            { key: 2, text: '修改手势密码', handler: () => { this._onClose(); forward(this, 'ResetPwd'); } },
                            { key: 3, text: '关于软件', handler: () => { this.setState({ modalVisible: false, detailVisible: true }); } }
                        ]
                    });
                }
            });
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
        forward(this, 'UserInfo');
    }

    _logout() {
        this._onClose();
        callService(this, 'logout.do', new FormData(), function () {
            Storage.getCurrentAccount(this, function (accountInfo) {
                accountInfo.token = '';
                Storage.setAccountInfo(this, accountInfo, function () {
                    Storage.setStorageAsync('currentAccount', '');
                    deleteAlias();
                    forward(this, 'Login');
                });
            });
        });
    }

    _renderUserItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this._selectUser(item) }}>
            <View style={[styles.menuContainer, { alignItems: 'center', justifyContent: 'center' }]}>
                <Image style={styles.img} source={require('../../../assets/image/head/user.png')} />
                <Text style={styles.menuText}>{item.realName}</Text>
                <Text style={styles.menuText}>{item.companyName}</Text>
                <Text style={styles.menuText}>{item.shopName}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    _selectUser(user) {
        Storage.getCurrentAccount(this, function (accountInfo) {
            accountInfo.currentUser = user;
            Storage.setAccountInfo(this, accountInfo);
        });
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

    _onDetailClose() {
        this.setState({ detailVisible: false });
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
                        <View style={styles.title}>
                            <Text style={{ flex: 1, marginLeft: 15, color: '#999', fontSize: 15 }}>
                                请选择用户
                            </Text>
                            <TouchableOpacity onPress={() => { this._onUserClose() }}>
                                <Image style={{ height: 25, width: 25, marginRight: 10 }} source={require('../../../assets/image/head/close.png')} />
                            </TouchableOpacity>
                        </View>
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
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={styles.innerContainer}>
                            <View style={styles.headContainer}>
                                <TouchableWithoutFeedback onPress={() => { this._gotoUserInfo() }}>
                                    <Image style={styles.headImg} source={require('../../../assets/image/head/head.png')} />
                                </TouchableWithoutFeedback>
                                <View style={styles.userInfoContainer}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.nameText}>{this.state.userInfo.realName}</Text>
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
                <Modal
                    visible={this.state.detailVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => { this._onDetailClose() }}>
                    <View style={styles.modalBackground}>
                        <View style={{ backgroundColor: '#fff', height: 240, width: 300, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 13, color: '#999', margin: 10 }}>当前版本号：{Constant.VERSION}</Text>
                            <Text style={{ fontSize: 16, color: '#333', margin: 10 }}>深圳市零烦恼软件科技有限公司</Text>
                            <TouchableOpacity onPress={() => {
                                let url = 'http://www.lingfannao.com/';
                                Linking.canOpenURL(url).then(supported => {
                                    if (supported) {
                                        return Linking.openURL(url);
                                    }
                                }).catch(err => { });
                            }}>
                                <Text style={{ fontSize: 14, color: '#666', margin: 10 }}>官网：http://www.lingfannao.com/</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { NativeModules.CallPhoneModule.callPhone('0755-82347927'); }}>
                                <Text style={{ fontSize: 14, color: '#666', margin: 10 }}>客服电话：0755-82347927</Text>
                            </TouchableOpacity>
                            <View style={{ height: 30, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity style={[styles.button, { width: 100, height: 25 }]} onPress={() => this._onDetailClose()}>
                                    <Text style={{ textAlign: 'center', color: '#333', fontSize: 14 }}>关闭</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal >
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        height: 30,
        width: (Dimensions.get('window').width - 60),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    img: {
        height: 20,
        width: 20
    },
    modalContainer: {
        backgroundColor: '#fff',
        width: (Dimensions.get('window').width - 60)
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'
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