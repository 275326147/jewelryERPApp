/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    Image,
    Alert,
    DeviceEventEmitter,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback
} from 'react-native';
import { QRScannerView } from 'ac-qrcode';
import { callService } from '../../utils/service';

export default class Checking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lockCamera: false,
            type: 1,
            keyword: '',
            item: {},
            showCamera: true,
            hasCheckGoldWeight4SubSheet: 0,
            hasCheckNum4SubSheet: 0
        };
    }

    componentDidMount() {
        this.msgListener = DeviceEventEmitter.addListener('commitCheck', (listenerMsg) => {
            let params = new FormData();
            params.append("subSheetId", this.state.item.id);
            callService(this, 'submitSubSheet.do', params, function (response) {
                Alert.alert(
                    '提示',
                    '提交成功',
                    [
                        { text: 'OK', onPress: () => this.props.navigation.navigate('Home') },
                    ],
                    { cancelable: false }
                );
            });
        });
        let params = new FormData();
        params.append("subSheetId", this.props.navigation.state.params.item.id);
        callService(this, 'goodsCheckSubSheet.do', params, function (response) {
            this.setState({
                item: response.subSheetInfo,
                hasCheckGoldWeight4SubSheet: response.subSheetInfo.checkGoldWeight,
                hasCheckNum4SubSheet: response.subSheetInfo.checkNum
            });
        });
    }

    componentWillUnmount() {
        this.msgListener && this.msgListener.remove();
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{ height: 100, flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#f3f3f1' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 55, height: 55, margin: 15 }} source={item.imgUrl} />
                </View>
                <View style={{ flex: 2, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={{ fontSize: 12, color: '#333', marginTop: 15 }}>商品条码  <Text style={{ fontSize: 12, color: '#999' }}>{item.barCode}</Text></Text>
                        <Text style={{ fontSize: 12, color: '#333', marginTop: 3 }}>商品名称  <Text style={{ fontSize: 12, color: '#999' }}>{item.goodsName}</Text></Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
                        <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{ fontSize: 10, color: '#333' }}>金重</Text>
                            <Text style={{ fontSize: 10, color: 'orange', marginTop: 3 }}>{item.weight}g</Text>
                        </View>
                        <View style={{ flex: 1, borderLeftWidth: 1, borderColor: '#f3f3f1', height: 20, alignItems: 'center' }}></View>
                        <View style={{ flex: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 10, color: '#333' }}>数量</Text>
                            <Text style={{ fontSize: 10, color: 'orange', marginTop: 3, marginLeft: 5 }}>{item.count}</Text>
                        </View>
                    </View>
                </View>
            </View >
        );
    }

    barcodeReceived(e) {
        if (!this.state.lockCamera) {
            this.setState({ lockCamera: true })
            Alert.alert(
                '提示',
                '条码号：' + e.data + ', 条码类型：' + e.type,
                [
                    { text: 'OK', onPress: () => this.setState({ lockCamera: false }) },
                ],
                { cancelable: false }
            )
        }
    }

    queryGoods() {
        let params = new FormData();
        params.append("subSheetId", this.state.item.id);
        params.append("codeType", this.state.type);
        params.append("codeStr", this.state.keyword);
        callService(this, 'doProcess4InputCheck.do', params, function (response) {
            let eventType = response.eventType;
            let master = this;
            switch (eventType) {
                case -1:
                    Alert.alert(
                        '提示',
                        response.msg,
                        [
                            { text: 'OK' }
                        ],
                        { cancelable: false }
                    );
                    break;
                case 1:
                    //选择一条进货记录，之后调用doProcess4InputCheck.do， codeType传4， importItemId传选择的importItemId
                    break;
                case 2:
                    //进货单一码多货
                    break;
                case 3:
                    //一码一货
                    master.setState({
                        goodsInfo: response.goodsInfo,
                        showCheckInfo: response.showCheckInfo,
                        hasCheckNum4SubSheet: response.hasCheckNum4SubSheet,
                        hasCheckGoldWeight4SubSheet: response.hasCheckGoldWeight4SubSheet
                    });
                    break;
                case 4:
                    //修改已盘点一码多货
                    break;
                default:
                    break;
            }
        });
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ height: 160 }}>
                    {
                        this.state.showCamera ?
                            <QRScannerView rectWidth={Dimensions.get('window').width - 80} rectHeight={100} cornerBorderWidth={1} scanBarMargin={25}
                                onScanResultReceived={this.barcodeReceived.bind(this)}
                                renderBottomMenuView={() => {
                                    return (
                                        <TouchableOpacity style={{ height: 30, width: Dimensions.get('window').width, alignItems: 'flex-end' }} onPress={() => { this.setState({ showCamera: false }) }}>
                                            <Image style={{ width: 20, height: 20 }} source={require('../../../assets/image/check/lock.png')} />
                                        </TouchableOpacity>
                                    )
                                }}
                                hintText={'  '}
                                renderTopBarView={() => {
                                    return (
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <View style={styles.view_title_container}>
                                                <TouchableOpacity onPress={() => { this.setState({ type: 1 }) }}>
                                                    <Text style={{ color: this.state.type === 1 ? '#7A67EE' : '#fff', fontSize: 14, marginRight: 60 }}>原条码</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => { this.setState({ type: 2 }) }}>
                                                    <Text style={{ color: this.state.type === 2 ? '#7A67EE' : '#fff', fontSize: 14, marginRight: 60 }}>条码</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => { this.setState({ type: 3 }) }}>
                                                    <Text style={{ color: this.state.type === 3 ? '#7A67EE' : '#fff', fontSize: 14 }}>证书号</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                }} />
                            :
                            <View style={styles.container}>
                                <View style={styles.view_title_container}>
                                    <TouchableOpacity onPress={() => { this.setState({ type: 1 }) }}>
                                        <Text style={{ color: this.state.type === 1 ? '#7A67EE' : '#999', fontSize: 14, marginRight: 60 }}>原条码</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.setState({ type: 2 }) }}>
                                        <Text style={{ color: this.state.type === 2 ? '#7A67EE' : '#999', fontSize: 14, marginRight: 60 }}>条码</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.setState({ type: 3 }) }}>
                                        <Text style={{ color: this.state.type === 3 ? '#7A67EE' : '#999', fontSize: 14 }}>证书号</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.searchContainer}>
                                    <TextInput style={styles.input} placeholder='&nbsp;&nbsp;请输入原条码号／条码号／证书号'
                                        onChangeText={(text) => this.state.keyword = text}
                                        underlineColorAndroid="transparent">
                                    </TextInput>
                                    <TouchableWithoutFeedback onPress={() => { this.queryGoods() }}>
                                        <Image style={{ height: 17, width: 14, marginTop: 3, marginLeft: -40 }} source={require('../../../assets/image/track/search.png')} />
                                    </TouchableWithoutFeedback>
                                    <TouchableOpacity onPress={() => { this.setState({ showCamera: true }) }}>
                                        <Image style={styles.cameraImg} source={require('../../../assets/image/head/camera.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                    }
                </View>
                <View style={{ height: 35, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1.1, fontSize: 12, color: '#333', textAlign: 'right' }}>盘点单号：</Text>
                    <Text style={{ flex: 2, fontSize: 12, color: '#999', textAlign: 'left' }}>{this.state.item.sheetNo}</Text>
                    <Text style={{ flex: 1, fontSize: 10, color: '#333', textAlign: 'right' }}>操作员：</Text>
                    <Text style={{ flex: 1.5, fontSize: 10, color: '#999', textAlign: 'left' }}>{this.state.item.createUserName}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {
                        this.state.goodsInfo ?
                            <View style={{ height: 100, flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#f3f3f1' }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image style={{ width: 55, height: 55, margin: 15 }} source={{ uri: this.state.goodsInfo.img }} />
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                        <Text style={{ fontSize: 12, color: '#333', marginTop: 15 }}>商品条码  <Text style={{ fontSize: 12, color: '#999' }}>{this.state.goodsInfo.barCode}</Text></Text>
                                        <Text style={{ fontSize: 12, color: '#333', marginTop: 3 }}>商品名称  <Text style={{ fontSize: 12, color: '#999' }}>{this.state.goodsInfo.goodsName}</Text></Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
                                        <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 10, color: '#333' }}>金重</Text>
                                            <Text style={{ fontSize: 10, color: 'orange', marginTop: 3 }}>{this.state.showCheckInfo.hasCheckGoldWeight}g</Text>
                                        </View>
                                        <View style={{ flex: 1, borderLeftWidth: 1, borderColor: '#f3f3f1', height: 20, alignItems: 'center' }}></View>
                                        <View style={{ flex: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <Text style={{ fontSize: 10, color: '#333' }}>数量</Text>
                                            <Text style={{ fontSize: 10, color: 'orange', marginTop: 3, marginLeft: 5 }}>{this.state.showCheckInfo.hasCheckNum}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View >
                            :
                            <View />
                    }
                </View>
                <View style={{ height: 35, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginLeft: 20, fontSize: 12, color: '#333' }}>总金重：</Text>
                    <Text style={{ fontSize: 12, color: 'orange' }}>{this.state.hasCheckGoldWeight4SubSheet}克</Text>
                    <Text style={{ fontSize: 12, color: '#333', marginLeft: 40 }}>总数量：</Text>
                    <Text style={{ fontSize: 12, color: 'orange' }}>{this.state.hasCheckNum4SubSheet}件</Text>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    cameraImg: {
        height: 18,
        width: 18,
        marginLeft: 25
    },
    view_title_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        height: 35,
        alignItems: 'center'
    },
    container: {
        height: 160,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    searchContainer: {
        height: 130,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row'
    },
    input: {
        fontSize: 12,
        height: 35,
        width: Dimensions.get('window').width - 60,
        borderRadius: 15,
        backgroundColor: '#f3f3f1',
        margin: 10,
        padding: 0
    }
});