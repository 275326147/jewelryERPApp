/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    Modal
} from 'react-native';
import data from './data';

export default class Follow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
    }

    //1 --进货   2 --调拨   3 --调价   4 --销售   5 --出库   6 --调款   7 --礼品兑换
    colorMap = {
        1: '#ACC2FA',
        2: '#93D987',
        3: '#7AD8C5',
        4: '#F8B5B5',
        5: '#83D0E3',
        6: '#93D987',
        7: '#EBC77D',
    }

    _renderProp = ({ item }) => {
        return (
            <View style={{ height: 20, flexDirection: 'row' }}>
                <Text style={{ flex: 1, fontSize: 12, color: '#333' }}>{item.label}</Text>
                <Text style={{ flex: 3, fontSize: 12, color: '#666', textAlign: 'left' }}>{item.value}</Text>
            </View>
        )
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{ height: 230, flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, margin: 10 }}>
                    <View style={[styles.leftTopContainer, { backgroundColor: this.colorMap[item.type] }]}>
                        <Text style={{ color: '#fff', fontSize: 13 }}>{item.key}</Text>
                    </View>
                    <View style={[styles.leftBottomContainer, { borderColor: this.colorMap[item.type] }]}>
                        <Text style={{ color: this.colorMap[item.type], fontSize: 13 }}>{item.title}</Text>
                    </View>
                </View>
                <View style={{ width: 1, borderWidth: 0.5, borderColor: '#999', borderStyle: 'dashed' }}></View>
                <View style={{ flex: 3, margin: 10, marginLeft: 15 }}>
                    <View style={[styles.rightTopContainer, { backgroundColor: this.colorMap[item.type] }]}>
                        <Text style={{ color: '#fff', fontSize: 12, marginLeft: 10 }}>操作时间：{item.lastUpdateDate}</Text>
                    </View>
                    <View style={styles.rightBottomContainer}>
                        <FlatList style={{ flex: 1, margin: 10 }} data={item.props} renderItem={this._renderProp} />
                    </View>
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
                    <TouchableWithoutFeedback onPress={() => { this.props.navigation.navigate('Scanner', { type: 'track' }); }}>
                        <Image style={{ height: 17, width: 14, marginTop: 5, marginLeft: -30 }} source={require('../../../assets/image/track/search.png')} />
                    </TouchableWithoutFeedback>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Scanner', { type: 'track' }); }}>
                        <Image style={styles.cameraImg} source={require('../../../assets/image/head/camera.png')} />
                    </TouchableOpacity>
                </View>
                {
                    data ?
                        <View style={{ flex: 1 }}>
                            <View style={styles.baseInfoContainer}>
                                <Image style={{ width: 80, height: 80, margin: 15 }} source={require('../../../assets/image/check/newCheck.png')} />
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.label, { marginTop: 15 }]}>商品条码      <Text style={styles.value}>{data.archivesNo}</Text></Text>
                                    <Text style={styles.label}>商品名称      <Text style={styles.value}>{data.goodsName}</Text></Text>
                                    <Text style={styles.label}>子名称          <Text style={styles.value}>{data.subGoodsName}</Text></Text>
                                    <Text style={styles.label}>供应商          <Text style={styles.value}>{data.supplierName}</Text></Text>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        {
                                            this.state.modalVisible ?
                                                <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }); }}>
                                                    <Image style={styles.arrowImg} source={require('../../../assets/image/track/up.png')} />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={() => { this.setState({ modalVisible: true }); }}>
                                                    <Image style={styles.arrowImg} source={require('../../../assets/image/track/down.png')} />
                                                </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            </View >
                            {
                                this.state.modalVisible ?
                                    <View style={styles.modalContainer}>
                                        <View style={{ borderTopWidth: 1.5, borderColor: '#f3f3f1', margin: 10 }}></View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>条码号</Text>
                                            <Text style={styles.detailValue}>{data.barCode}</Text>
                                            <Text style={styles.detailLabel}>原条码号</Text>
                                            <Text style={styles.detailValue}>{data.oldBarCode}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>证书号</Text>
                                            <Text style={styles.detailValue}>{data.certificateNo}</Text>
                                            <Text style={styles.detailLabel}>GIA证书</Text>
                                            <Text style={styles.detailValue}>{data.giaCertificateNo}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>款式</Text>
                                            <Text style={styles.detailValue}>{data.style}</Text>
                                            <Text style={styles.detailLabel}>款号</Text>
                                            <Text style={styles.detailValue}>{data.styleNo}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>实际分类</Text>
                                            <Text style={styles.detailValue}>{data.goodsClassify}</Text>
                                            <Text style={styles.detailLabel}>备注</Text>
                                            <Text style={styles.detailValue}>{data.remarks}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>主石重</Text>
                                            <Text style={styles.detailValue}>{data.mainStoneWeight}</Text>
                                            <Text style={styles.detailLabel}>主石数</Text>
                                            <Text style={styles.detailValue}>{data.mainStoneNum}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>颜色</Text>
                                            <Text style={styles.detailValue}>{data.mainStoneColor}</Text>
                                            <Text style={styles.detailLabel}>级别</Text>
                                            <Text style={styles.detailValue}>{data.mainStoneClarity}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>副石重</Text>
                                            <Text style={styles.detailValue}>{data.subStone1Weight}</Text>
                                            <Text style={styles.detailLabel}>副石数</Text>
                                            <Text style={styles.detailValue}>{data.subStone1Num}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>副石2数重</Text>
                                            <Text style={styles.detailValue}>{data.subStone2Weight}</Text>
                                            <Text style={styles.detailLabel}>副石2数</Text>
                                            <Text style={styles.detailValue}>{data.subStone2Num}</Text>
                                        </View>
                                    </View>
                                    :
                                    <View></View>
                            }
                            <FlatList style={{ flex: 1, marginTop: 10 }} data={data.steps} renderItem={this._renderItem} />
                        </View>
                        :
                        <Image style={styles.img} source={require('../../../assets/image/info/no_follow.png')} />
                }
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    modalContainer: {
        height: 200,
        backgroundColor: '#fff'
    },
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
        marginLeft: 30,
        marginRight: 10,
        marginTop: 5
    },
    arrowImg: {
        marginTop: 10,
        marginLeft: 80
    },
    baseInfoContainer: {
        height: 130,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#f3f3f1'
    },
    label: {
        fontSize: 12,
        color: '#333',
        marginTop: 5
    },
    value: {
        fontSize: 12,
        color: '#666'
    },
    detailLine: {
        height: 20,
        flexDirection: 'row',
        marginLeft: 10
    },
    detailLabel: {
        flex: 1,
        fontSize: 12,
        color: '#333'
    },
    detailValue: {
        flex: 2,
        fontSize: 12,
        color: '#666'
    },
    leftTopContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: 80,
        borderRadius: 4
    },
    leftBottomContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        width: 80,
        marginTop: -5,
        backgroundColor: 'transparent',
        borderRadius: 4,
        borderWidth: 1.5
    },
    rightTopContainer: {
        height: 30,
        borderRadius: 3,
        justifyContent: 'center'
    },
    rightBottomContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 3
    }
});