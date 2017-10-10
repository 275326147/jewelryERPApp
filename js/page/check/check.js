/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
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
    Alert
} from 'react-native';
import { callService, handleResult } from '../../utils/service';

export default class Check extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkData: []
        };
    }

    querySubSheet() {
        callService(this, 'goodsCheckSubSheetList.do', new FormData(), function (response) {
            if (response.subSheetList) {
                this.setState({
                    checkData: handleResult(response.subSheetList)
                });
            }
        });
    }

    componentDidMount() {
        this.querySubSheet();
    }

    _delSubSheet(subSheetId) {
        Alert.alert(
            '提示',
            '删除后将无法回退，是否确定删除盘点单？',
            [
                {
                    text: 'OK', onPress: () => {
                        let params = new FormData();
                        params.append("subSheetId", subSheetId);
                        callService(this, 'delSubSheet.do', params, function (response) {
                            querySubSheet();
                            Alert.alert(
                                '提示',
                                '删除成功',
                                [
                                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                                ],
                                { cancelable: false }
                            );
                        });
                    }
                },
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
            ],
            { cancelable: false }
        );
    }

    _gotoPage(url, param) {
        this.props.navigation.navigate(url, param);
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{ height: 75, flexDirection: 'column', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#f3f3f1' }}>
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{ flex: 1, color: '#333', fontSize: 13, marginLeft: 10 }}>单号</Text>
                    <Text style={{ flex: 3, color: '#666', fontSize: 13 }}>{item.sheetNo}</Text>
                    <Text style={{ flex: 4, color: '#666', fontSize: 13, textAlign: 'right', marginRight: 10 }}>{item.lastUpdateDate}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{ flex: 1.5, color: '#333', fontSize: 11, marginLeft: 10 }}>操作员：</Text>
                    <Text style={{ flex: 4, color: '#666', fontSize: 11, textAlign: 'left' }}>{item.createUserName}</Text>
                    <TouchableOpacity onPress={() => { this._delSubSheet(item.id) }}>
                        <Text style={{ flex: 2, color: '#333', fontSize: 13, marginRight: 15 }}>删除</Text>
                    </TouchableOpacity>
                    <View style={{ borderLeftWidth: 1, borderColor: '#f3f3f1', width: 10, height: 20 }}></View>
                    <TouchableOpacity onPress={() => { this._gotoPage('Checking', { item: item }) }}>
                        <Text style={{ flex: 2, color: '#333', fontSize: 13, marginRight: 10, marginLeft: 5 }}>续盘</Text>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{ flexDirection: 'row', height: 60 }}>
                    <TouchableWithoutFeedback onPress={() => { this._gotoPage('NewCheck') }}>
                        <View style={[styles.menuContainer, { borderRightWidth: 1, borderColor: '#f3f3f1' }]}>
                            <Image style={styles.menuImg} source={require('../../../assets/image/check/newCheck.png')} />
                            <Text style={styles.menuText}>新建盘点</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { this._gotoPage('QueryCheck') }}>
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