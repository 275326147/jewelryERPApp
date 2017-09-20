import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList
} from 'react-native';
import data from './transferData';

export default class WaitReceive extends Component {

    _getData() {
        let filterData = [];
        data.forEach(function (item) {
            if (item.status === 1) {
                filterData.push(item);
            }
        });
        return filterData;
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{ height: 280, backgroundColor: '#fff', marginTop: 10 }}>
                <View style={{ marginLeft: 20 }}>
                    <Text style={{ fontSize: 13, color: '#333' }}>单号：</Text>
                    <Text style={{ fontSize: 13, color: '#333' }}>{item.no}</Text>
                </View>
                <View style={{ width: 1, borderWidth: 0.5, borderColor: '#999', borderStyle: 'dashed' }}></View>
                <View></View>
                <View></View>
                <View></View>
            </View >
        );
    }

    render() {
        let receiveData = this._getData();
        return (
            <View style={{ flex: 1 }} >
                <View style={{ height: 30, marginTop: 10, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ height: 20, width: 20, margin: 10, marginLeft: 20 }} source={require('../../../assets/image/home/check.png')} />
                    <Text style={{ fontSize: 13, color: '#333' }}>待接收在途</Text>
                </View >
                <FlatList style={{ flex: 1 }} data={receiveData} renderItem={this._renderItem} />
            </View>
        );
    }
}

const styles = StyleSheet.create({

});