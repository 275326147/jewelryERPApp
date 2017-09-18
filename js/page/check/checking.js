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
    Image
} from 'react-native';
import { QRScannerView } from 'ac-qrcode';

export default class Checking extends Component {
    constructor(props) {
        super(props);
        this.state = this._getTotal();
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

    _getTotal() {
        let totalWeight = 0;
        let totalCount = 0;
        this.goodsData.forEach(function (item) {
            totalCount = totalCount + item.count;
            totalWeight = totalWeight + item.weight * item.count;
        });
        return {
            totalCount: totalCount,
            totalWeight: totalWeight
        };
    }

    _refreshTotal() {
        this.setState(this._getTotal());
    }

    barcodeReceived(e) {

    }

    render() {
        let item = this.props.navigation.state.params.item;
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
                    <Text style={{ flex: 2, fontSize: 12, color: '#999', textAlign: 'left' }}>{item.checkNo}</Text>
                    <Text style={{ flex: 1, fontSize: 10, color: '#333', textAlign: 'right' }}>操作员：</Text>
                    <Text style={{ flex: 1.5, fontSize: 10, color: '#999', textAlign: 'left' }}>{item.operator}</Text>
                </View>
                <FlatList style={{ flex: 1 }} data={this.goodsData} renderItem={this._renderItem} />
                <View style={{ height: 35, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginLeft: 20, fontSize: 12, color: '#333' }}>总金重：</Text>
                    <Text style={{ fontSize: 12, color: 'orange' }}>{this.state.totalWeight}克</Text>
                    <Text style={{ fontSize: 12, color: '#333', marginLeft: 40 }}>总数量：</Text>
                    <Text style={{ fontSize: 12, color: 'orange' }}>{this.state.totalCount}件</Text>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
});