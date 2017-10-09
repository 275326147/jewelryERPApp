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
    Alert
} from 'react-native';
import { QRScannerView } from 'ac-qrcode';
import { callService } from '../../utils/service';

export default class Checking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lockCamera: false,
            item: {}
        };
    }

    componentWillMount() {
        this.setState({
            item: this.props.navigation.state.params.item
        });
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
    }

    componentWillUnmount() {
        this.msgListener && this.msgListener.remove();
    }

    goodsData = [{
        key: 1,
        imgUrl: require('../../../assets/image/check/newCheck.png'),
        name: '18k金六爪钻石戒指',
        code: 'jw20170918012345',
        weight: 3,
        count: 2
    }];

    _renderItem = ({ item }) => {
        return (
            <View style={{ height: 100, flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#f3f3f1' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 55, height: 55, margin: 15 }} source={item.imgUrl} />
                </View>
                <View style={{ flex: 2, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={{ fontSize: 12, color: '#333', marginTop: 15 }}>商品条码  <Text style={{ fontSize: 12, color: '#999' }}>{item.code}</Text></Text>
                        <Text style={{ fontSize: 12, color: '#333', marginTop: 3 }}>商品名称  <Text style={{ fontSize: 12, color: '#999' }}>{item.name}</Text></Text>
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

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ height: 120 }}>
                    <QRScannerView rectWidth={Dimensions.get('window').width - 80} rectHeight={80} cornerBorderWidth={1} scanBarMargin={25}
                        onScanResultReceived={this.barcodeReceived.bind(this)}
                        renderTopBarView={() => { return (<View></View>) }}
                        renderBottomMenuView={() => { return (<View></View>) }} />
                </View>
                <View style={{ height: 35, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1.1, fontSize: 12, color: '#333', textAlign: 'right' }}>盘点单号：</Text>
                    <Text style={{ flex: 2, fontSize: 12, color: '#999', textAlign: 'left' }}>{this.state.item.sheetNo}</Text>
                    <Text style={{ flex: 1, fontSize: 10, color: '#333', textAlign: 'right' }}>操作员：</Text>
                    <Text style={{ flex: 1.5, fontSize: 10, color: '#999', textAlign: 'left' }}>{this.state.item.createUserName}</Text>
                </View>
                <FlatList style={{ flex: 1 }} data={this.goodsData} renderItem={this._renderItem} />
                <View style={{ height: 35, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginLeft: 20, fontSize: 12, color: '#333' }}>总金重：</Text>
                    <Text style={{ fontSize: 12, color: 'orange' }}>{this.state.item.checkGoldWeight}克</Text>
                    <Text style={{ fontSize: 12, color: '#333', marginLeft: 40 }}>总数量：</Text>
                    <Text style={{ fontSize: 12, color: 'orange' }}>{this.state.item.checkStoneWeight}件</Text>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
});