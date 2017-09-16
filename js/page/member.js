/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Image,
    FlatList,
    Dimensions,
    TextInput
} from 'react-native';

export default class Member extends Component {
    memberData = [{
        key: 1,
        name: '王尼玛',
        phone: '13838380438',
        sex: '男',
        birthday: '1988-09-01',
        cardNo: '1234567',
        cardType: 1,
        cardStore: '水贝1店',
        cardDate: '2017-09-08',
        mark: 13988,
        spend: '￥198, 900'
    }, {
        key: 2,
        name: '张尼玛',
        phone: '13666666666',
        sex: '男',
        birthday: '1988-09-01',
        cardNo: '11111111',
        cardType: 2,
        cardStore: '水贝2店',
        cardDate: '2017-01-82',
        mark: 8900,
        spend: '￥78, 900'
    }, {
        key: 3,
        name: '周尼玛',
        phone: '13888888888',
        sex: '女',
        birthday: '1991-08-01',
        cardNo: '3345678',
        cardType: 3,
        cardStore: '水贝2店',
        cardDate: '2017-09-08',
        mark: 12009,
        spend: '￥168, 200'
    }, {
        key: 4,
        name: '高尼玛',
        phone: '13999999999',
        sex: '女',
        birthday: '1978-02-01',
        cardNo: '2345678',
        cardType: 4,
        cardStore: '水贝1店',
        cardDate: '2017-09-08',
        mark: 3988,
        spend: '￥8, 900'
    }]

    _renderItem = ({ item }) => {
        let src = '';
        let typeName = '';
        switch (item.cardType) {
            case 1:
                src = require('../../assets/image/member/diamond.png');
                typeName = '钻石卡';
                break;
            case 2:
                src = require('../../assets/image/member/gold.png');
                typeName = '金卡';
                break;
            case 3:
                src = require('../../assets/image/member/silver.png');
                typeName = '银卡';
                break;
            default:
                src = require('../../assets/image/member/normal.png');
                typeName = '普卡';
                break;
        }
        return (
            <View style={styles.itemContainer}>
                <Image style={styles.img} source={src}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 2 }}>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    会员姓名
                            </Text>
                                <Text style={styles.valueText}>
                                    {item.name}
                                </Text>
                                <View style={styles.type}>
                                    <Text style={{ fontSize: 10, color: '#333' }}>
                                        {typeName}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    会员电话
                            </Text>
                                <Text style={styles.valueText}>
                                    {item.phone}
                                </Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别
                            </Text>
                                <Text style={styles.valueText}>
                                    {item.sex}
                                </Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号
                            </Text>
                                <Text style={styles.valueText}>
                                    {item.cardNo}
                                </Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    会员生日
                            </Text>
                                <Text style={styles.valueText}>
                                    {item.birthday}
                                </Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    发卡门店
                            </Text>
                                <Text style={styles.valueText}>
                                    {item.cardStore}
                                </Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    发卡日期
                            </Text>
                                <Text style={styles.valueText}>
                                    {item.cardDate}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={[styles.marItem, { borderBottomWidth: 2, borderColor: '#f3f3f1' }]}>
                                <Text style={styles.markLabel}>
                                    积分总数
                            </Text>
                                <Text style={styles.markValue}>
                                    {item.mark}
                                </Text>
                            </View>
                            <View style={styles.marItem}>
                                <Text style={[styles.markLabel, { marginTop: 10 }]}>
                                    累计消费
                            </Text>
                                <Text style={styles.markValue}>
                                    {item.spend}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Image>
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.searchContainer}>
                    <TextInput style={styles.input} placeholder='&nbsp;&nbsp;请输入会员卡号／会员名／手机号'
                        underlineColorAndroid="transparent" />
                </View>
                <FlatList style={{ flex: 1, marginTop: 10 }} data={this.memberData} renderItem={this._renderItem} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    input: {
        fontSize: 12,
        height: 25,
        width: Dimensions.get('window').width - 40,
        borderRadius: 15, backgroundColor: '#f3f3f1',
        marginTop: 10,
        marginBottom: 10,
        marginRight: 20,
        marginLeft: 20,
        padding: 0
    },
    searchContainer: {
        height: 40,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    img: {
        resizeMode: Image.resizeMode.stretch,
        width: Dimensions.get('window').width,
        height: 150
    },
    itemContainer: {
        height: 150,
        marginBottom: 10
    },
    item: {
        height: 15,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        marginTop: 5
    },
    markItem: {
        height: 45,
        flexDirection: 'column'
    },
    markLabel: {
        marginTop: 20,
        marginRight: 10,
        textAlign: 'right',
        backgroundColor: 'transparent',
        fontSize: 13,
        color: '#999'
    },
    markValue: {
        marginTop: 5,
        marginRight: 10,
        fontSize: 13,
        textAlign: 'right',
        backgroundColor: 'transparent',
        color: 'orange',
        marginBottom: 5
    },
    labelText: {
        fontSize: 12,
        color: '#333',
        marginLeft: 10,
        marginRight: 20
    },
    valueText: {
        fontSize: 12,
        color: '#999',
        marginRight: 20
    },
    type: {
        marginLeft: 20,
        borderRadius: 2,
        height: 15,
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0EAD3'
    }
});