/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React from 'react';
import PageComponent from '../PageComponent';
import {
    ScrollView,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    Text,
    Dimensions,
    FlatList,
    DeviceEventEmitter
} from 'react-native';
import Spinner from '../../components/loading/loading';
import { callService, handleResult } from '../../utils/service';
import { alert, forward, unlockScreen } from '../../utils/common';

export default class Check extends PageComponent {
    constructor(props) {
        super(props);
        this.backRoute = 'Home';
        this.state = {
            loading: false,
            checkData: []
        };
    }

    querySubSheet() {
        this.setState({
            loading: true
        }, function () {
            callService(this, 'goodsCheckSubSheetList.do', new FormData(), function (response) {
                if (response.subSheetList) {
                    this.setState({
                        checkData: handleResult(response.subSheetList)
                    });
                }
                unlockScreen(this);
            }, function () {
                unlockScreen(this);
            });
        });
    }

    componentDidMount() {
        super.componentDidMount('盘点主界面');
        this.querySubSheet();
        this.msgListener = DeviceEventEmitter.addListener('refreshSubCheck', (listenerMsg) => {
            this.querySubSheet();
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.msgListener && this.msgListener.remove();
    }

    _delSubSheet(subSheetId) {
        alert(
            this,
            'info',
            '删除后将无法回退，是否确定删除盘点单？',
            () => {
                let params = new FormData();
                params.append("subSheetId", subSheetId);
                callService(this, 'delSubSheet.do', params, function (response) {
                    this.querySubSheet();
                    alert(this, 'info', '删除成功');
                });
            },
            () => { }
        );
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{ height: 85, flexDirection: 'column', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#f3f3f1' }}>
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{ width: 50, color: '#333', fontSize: 13, marginLeft: 10 }}>单号</Text>
                    <Text style={{ flex: 2, color: '#666', fontSize: 13 }}>{item.sheetNo}</Text>
                    <Text style={{ flex: 1, color: '#666', fontSize: 13, textAlign: 'right', marginRight: 10 }}>{item.sheetDate}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{ width: 50, color: '#333', fontSize: 13, marginLeft: 10 }}>门店</Text>
                    <Text style={{ flex: 2, color: '#666', fontSize: 13 }}>{item.deptAreaName}</Text>
                    <Text style={{ flex: 1, color: '#666', fontSize: 13, textAlign: 'right', marginRight: 10 }}>{item.storeName}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, marginBottom: 2 }}>
                    <Text style={{ flex: 1.5, color: '#333', fontSize: 11, marginLeft: 10 }}>操作员：</Text>
                    <Text style={{ flex: 4, color: '#666', fontSize: 11, textAlign: 'left' }}>{item.createUserName}</Text>
                    <TouchableOpacity onPress={() => { this._delSubSheet(item.id) }}>
                        <Text style={{ flex: 2, color: '#333', fontSize: 13, marginRight: 15 }}>删除</Text>
                    </TouchableOpacity>
                    <View style={{ borderLeftWidth: 1, borderColor: '#f3f3f1', width: 10, height: 20 }}></View>
                    <TouchableOpacity onPress={() => { forward(this, 'Checking', { item: item }) }}>
                        <Text style={{ flex: 2, color: '#333', fontSize: 13, marginRight: 10, marginLeft: 5 }}>续盘</Text>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Spinner visible={this.state.loading} textContent={""} textStyle={{ color: '#FFF' }} />
                <View style={{ flexDirection: 'row', height: 60 }}>
                    <TouchableWithoutFeedback onPress={() => { forward(this, 'NewCheck') }}>
                        <View style={[styles.menuContainer, { borderRightWidth: 1, borderColor: '#f3f3f1' }]}>
                            <Image style={styles.menuImg} source={require('../../../assets/image/check/newCheck.png')} />
                            <Text style={styles.menuText}>新建盘点</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { forward(this, 'QueryCheck') }}>
                        <View style={styles.menuContainer}>
                            <Image style={styles.menuImg} source={require('../../../assets/image/check/queryCheck.png')} />
                            <Text style={styles.menuText}>盘点单查询</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {
                    this.state.checkData.length === 0 ?
                        <View>
                            <View style={styles.textContainer}>
                                <Text style={{ flex: 1, marginLeft: 10, fontSize: 12, color: '#333' }}>未提交盘点单</Text>
                                <Text style={{ flex: 1, textAlign: 'right', marginRight: 10, color: '#999', fontSize: 10 }}>暂无</Text>
                            </View>
                            <Image style={styles.img} source={require('../../../assets/image/info/no_check.png')} />
                        </View>
                        :
                        <View>
                            <View style={styles.textContainer}>
                                <Text style={{ flex: 1, marginLeft: 10, fontSize: 12, color: '#333' }}>未提交盘点单</Text>
                                <View style={{ backgroundColor: '#f7656f', borderRadius: 50, width: 15, height: 15, marginRight: 10 }}>
                                    <Text style={{ backgroundColor: 'transparent', textAlign: 'center', color: '#fff', fontSize: 10 }}>{this.state.checkData.length}</Text>
                                </View>
                            </View>
                            <FlatList style={{ flex: 1 }} data={this.state.checkData} renderItem={this._renderItem} />
                        </View>
                }
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    menuContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    menuImg: {
        height: 35,
        width: 35
    },
    menuText: {
        fontSize: 13,
        color: '#999',
        marginLeft: 10
    },
    img: {
        marginTop: 80,
        marginLeft: (Dimensions.get('window').width / 2 - 100),
        height: 200,
        width: 200
    },
    textContainer: {
        height: 30,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    }
});