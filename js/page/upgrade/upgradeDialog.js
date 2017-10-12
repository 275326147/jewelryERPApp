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
    Platform
} from 'react-native';
import { callService } from '../../utils/service';
import { Constant } from '../../utils/common';

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
        params.append("platformName", 'beta');
        params.append("packageName", 'com.jewelryerpapp');
        params.append("appType", Platform.OS === 'android' ? 1 : 2);
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
                        <ScrollView style={styles.scroll}>
                            <Text style={styles.text}>发现新版本   {this.state.appInfo.versionName}                <Text style={styles.sizeText}>{this.state.appInfo.size}MB</Text></Text>
                            <Text style={styles.text}>
                                升级内容：
                            </Text>
                            <Text style={styles.text}>
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
            </Modal>
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
        width: Dimensions.get('window').width - 60,
        height: 300
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
        width: Dimensions.get('window').width - 60,
        height: 80
    },
    text: {
        color: '#666',
        fontSize: 13
    },
    sizeText: {
        color: '#DCDCDC',
        fontSize: 12
    }
});