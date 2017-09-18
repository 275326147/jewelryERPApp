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
    TouchableWithoutFeedback
} from 'react-native';

export default class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = { modalVisible: false };
    }

    componentDidMount() {
        //注意addListener的key和emit的key保持一致
        this.msgListener = DeviceEventEmitter.addListener('showSettings', (listenerMsg) => {
            this.setState({
                modalVisible: true
            })
        });
    }

    componentWillUnmount() {
        //此生命周期内，去掉监听
        this.msgListener && this.msgListener.remove();
    }

    menuData = [{ key: 1, text: '关于软件', subText: 'v1.0', img: require('../../../assets/image/head/new.png') },
    { key: 2, text: '清除缓存', url: '', img: '' },
    { key: 3, text: '管理手势密码', url: '', img: '' }];

    _renderItem = ({ item }) => (
        <View style={styles.menuContainer}>
            <Text style={styles.menuText}>{item.text}</Text>
            {item.img ? <Image style={styles.menuImg} source={item.img} /> : <View />}
            <Text style={styles.subText}>{item.subText}</Text>
        </View>
    );

    _onClose() {
        this.setState({ modalVisible: false });
    }

    _gotoUserInfo() {
        this._onClose();
        this.props.navigation.navigate('UserInfo');
    }

    render() {
        return (
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
                                    <Text style={styles.nameText}>陈大大</Text>
                                    <View style={styles.subNameContainer}>
                                        <Text style={styles.subNameText}>营业员</Text>
                                    </View>
                                </View>
                                <Text style={styles.companyText}>星环珠宝公司</Text>
                                <Text style={styles.companyText}>水贝1店</Text>
                            </View>
                        </View>
                        <FlatList style={{ flex: 1 }} data={this.menuData} renderItem={this._renderItem} />
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>退出登录</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onPress={() => { this._onClose() }}>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
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
    subText: {
        marginTop: 15,
        marginLeft: 100,
        color: '#999'
    },
    menuImg: {
        height: 12,
        width: 28,
        marginTop: 16
    },
    menuText: {
        margin: 15,
        marginRight: 10
    },
    button: {
        height: 36,
        width: 180,
        borderWidth: 1,
        borderColor: '#b5b5b5',
        borderRadius: 18,
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