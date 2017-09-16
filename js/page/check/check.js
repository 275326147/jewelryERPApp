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
    Image,
    Text,
    Dimensions,
    FlatList
} from 'react-native';

export default class Check extends Component {
    constructor(props) {
        super(props);
    }

    checkData = [{
        checkNo: 'jw123456789',
        operator: '张尼玛',
        lastUpdateDate: '2017-09-07 18:30:01'
    }, {
        checkNo: 'jw222288888',
        operator: '周尼玛',
        lastUpdateDate: '2017-09-15 08:30:01'
    }];

    _gotoPage(url) {
        this.props.navigation.navigate(url);
    }

    _renderItem = ({ item }) => {
        return (
            <View>
                
            </View>
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
                    this.checkData.length === 0 ?
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
                                <Text style={{ flex: 1, textAlign: 'right', marginRight: 10, color: '#999', fontSize: 10 }}>{this.checkData.length}</Text>
                            </View>
                            <FlatList style={{ flex: 1 }} data={this.checkData} renderItem={this._renderItem} />
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