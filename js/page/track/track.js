/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity,
    FlatList
} from 'react-native';
import data from './data';

export default class Follow extends Component {
    constructor(props) {
        super(props);
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{ height: 140, backgroundColor: '#fff', marginTop: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1, marginLeft: 10, fontSize: 14, color: '#333' }}>单号  <Text style={{ fontSize: 14, color: '#666' }}>{item.checkNo}</Text></Text>
                    <Text style={{ flex: 1, textAlign: 'right', marginRight: 10, fontSize: 14, color: '#666' }}>{item.lastUpdateDate}</Text>
                </View>
                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f3f1', marginLeft: 20, marginRight: 20 }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={{ textAlign: 'center', fontSize: 13, color: '#333' }}>总金重</Text>
                        <Text style={{ textAlign: 'center', fontSize: 13, color: 'orange', marginTop: 3 }}>{item.totalWeight}</Text>
                    </View>
                    <View style={{ height: 40, width: 1, borderLeftWidth: 1, borderColor: '#CFCFCF' }}></View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={{ textAlign: 'center', fontSize: 13, color: '#333' }}>盘点数量</Text>
                        <Text style={{ textAlign: 'center', fontSize: 13, color: 'orange', marginTop: 3 }}>{item.totalCount}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, marginTop: 20 }}>
                    <Text style={{ color: '#333', marginLeft: 10, fontSize: 12 }}>操作员:  <Text style={{ color: '#999', fontSize: 12 }}>{item.operator}</Text></Text>
                </View>
            </View >
        );
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput style={styles.input} placeholder='&nbsp;&nbsp;请输入商品条码'
                        underlineColorAndroid="transparent" />
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Scanner', { type: 'track' }); }}>
                        <Image style={styles.cameraImg} source={require('../../../assets/image/head/camera.png')} />
                    </TouchableOpacity>
                </View>
                {
                    data ?
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 200, flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#f3f3f1' }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image style={{ width: 55, height: 55, margin: 15 }} source={require('../../../assets/image/check/newCheck.png')} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 12, color: '#333', marginTop: 15 }}>商品条码  <Text style={{ fontSize: 12, color: '#999' }}>{data.archivesNo}</Text></Text>
                                    <Text style={{ fontSize: 12, color: '#333', marginTop: 3 }}>商品名称  <Text style={{ fontSize: 12, color: '#999' }}>{data.name}</Text></Text>
                                    <Text style={{ fontSize: 12, color: '#333', marginTop: 3 }}>子名称  <Text style={{ fontSize: 12, color: '#999' }}>{data.name}</Text></Text>
                                    <Text style={{ fontSize: 12, color: '#333', marginTop: 3 }}>供应商  <Text style={{ fontSize: 12, color: '#999' }}>{data.name}</Text></Text>
                                </View>
                            </View >
                            <FlatList style={{ flex: 1 }} data={data.steps} renderItem={this._renderItem} />
                        </View>
                        :
                        <Image style={styles.img} source={require('../../../assets/image/info/no_follow.png')} />
                }
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {
        fontSize: 12,
        height: 25,
        marginLeft: 10,
        marginTop: 10,
        width: (Dimensions.get('window').width - 50),
        borderRadius: 15, backgroundColor: '#f3f3f1',
        padding: 0
    },
    searchContainer: {
        height: 40,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    img: {
        marginTop: 80,
        marginLeft: (Dimensions.get('window').width / 2 - 100),
        height: 200,
        width: 200
    },
    cameraImg: {
        height: 18,
        width: 18,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5
    },
});