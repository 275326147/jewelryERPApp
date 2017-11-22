/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    Modal,
    Text,
    Image,
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    Platform,
    Linking
} from 'react-native';
import { callService } from '../../utils/service';
import { Constant, alert } from '../../utils/common';

export default class UpgradeDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            appInfo: {},
            modalVisible: false
        };
    }

    componentDidMount() {
        let params = new FormData();
        params.append("versionCode", Constant.VERSION);
        callService(this, 'updataCheck.do', params, function (response) {
            if (response.needUpdateFlag === 1) {
                this.setState({
                    appInfo: response.appInfo,
                    modalVisible: true
                });
            }
        });
    }

    _onClose() {
        this.setState({ modalVisible: false });
    }

    _upgrade() {
        let url = Platform.OS === 'android' ? 'market://details?id=6633' : 'itms-apps://itunes.apple.com/cn/app/jie-zou-da-shi/id493901993?mt=8';
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                alert(this, 'error', '无法前往应用商店，请联系管理员');
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => alert(this, 'error', '无法前往应用商店，请联系管理员'));
    }

    render() {
        return (
            <Modal
                visible={this.state.modalVisible}
                animationType={'slide'}
                transparent={true}
                onRequestClose={() => { this._onClose() }}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Image style={styles.img} source={require('../../../assets/image/upgrade/upgrade.png')} />
                        <View style={{ height: 30, width: 250, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.text, { marginLeft: 20 }]}>
                                发现新版本
                                </Text>
                            <Text style={styles.text}>
                                {this.state.appInfo.versionCode}
                            </Text>
                            <Text style={styles.sizeText}>
                                {parseInt(this.state.appInfo.size / 1024)}MB
                                </Text>
                        </View>
                        <View style={{ height: 1, width: 250, marginLeft: 20, marginRight: 20, borderBottomWidth: 1, borderColor: '#f3f3f1' }} />
                        <ScrollView style={styles.scroll}>
                            <Text style={styles.contentText}>
                                升级内容：
                            </Text>
                            <Text style={styles.contentText}>
                                {this.state.appInfo.modify}
                            </Text>
                        </ScrollView>
                        <View style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity style={styles.button} onPress={() => this._upgrade()}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>立即更新</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        width: 250,
        height: 340,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    button: {
        height: 30,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderWidth: 0,
        width: 180,
        backgroundColor: '#6334E6'
    },
    scroll: {
        flex: 1
    },
    img: {
        width: 250,
        height: 80
    },
    text: {
        flex: 1,
        color: '#757677',
        fontSize: 14
    },
    sizeText: {
        color: '#B6B7B8',
        fontSize: 14,
        marginRight: 20
    },
    contentText: {
        color: '#757677',
        fontSize: 14,
        marginTop: 5
    }
});