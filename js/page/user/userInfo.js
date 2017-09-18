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
    FlatList
} from 'react-native';

export default class Member extends Component {
    baseInfo = [{
        key: '姓名',
        value: '陈大大'
    }, {
        key: '性别',
        value: '女'
    }]

    userInfo = [{
        key: '所属公司',
        value: '星环珠宝公司'
    }, {
        key: '所属门店',
        value: '水贝1店'
    }, {
        key: '所属职能',
        value: '营业员'
    }, {
        key: '绑定手机',
        value: '18888888888'
    }]

    _renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.labelText}>{item.key}</Text>
            <Text style={styles.valueText}>{item.value}</Text>
        </View>
    )

    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.imgContainer}>
                        <Image style={styles.headImg} source={require('../../../assets/image/head/head.png')} />
                    </View>
                    <FlatList style={{ flex: 1 }} data={this.baseInfo} renderItem={this._renderItem} />
                </View>
                <View style={styles.infoContainer}>
                    <FlatList style={{ flex: 1, marginTop: 12 }} data={this.userInfo} renderItem={this._renderItem} />
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        height: 200
    },
    imgContainer: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ede9ff'
    },
    headImg: {
        height: 80,
        width: 80
    },
    infoContainer: {
        flex: 1,
        backgroundColor: '#f3f3f1'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 40,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#f3f3f1'
    },
    labelText: {
        flex: 1,
        fontSize: 13,
        color: '#333333',
        marginLeft: 10
    },
    valueText: {
        flex:1,
        fontSize: 13,
        color: '#999999',
        textAlign: 'right',
        marginRight: 10
    }
});