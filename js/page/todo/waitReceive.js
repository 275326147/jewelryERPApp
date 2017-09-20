import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity
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
            <View style={styles.itemContainer}>
                <View style={{ marginLeft: 20, flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{ fontSize: 14, color: '#333' }}>单号：</Text>
                    <Text style={{ fontSize: 14, color: '#333' }}>{item.no}</Text>
                </View>
                <View style={styles.split}></View>
                <View style={{ height: 100, marginLeft: 20, marginTop: 5 }}>
                    <Text style={styles.label}>发出门店  <Text style={styles.value}>{item.fromStore}</Text></Text>
                    <Text style={styles.label}>发出柜台  <Text style={styles.value}>{item.fromCounter}</Text></Text>
                    <Text style={styles.label}>发出时间  <Text style={styles.value}>{item.fromDate}</Text></Text>
                    <Text style={styles.label}>接收门店  <Text style={styles.value}>{item.toStore}</Text></Text>
                    <Text style={styles.label}>接收柜台  <Text style={styles.value}>{item.toCounter}</Text></Text>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.detailContainer}>
                        <Text style={styles.label}>数量</Text>
                        <Text style={styles.value}>{item.count}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.label}>标价金额</Text>
                        <Text style={[styles.value, { color: 'orange' }]}>{item.price}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.label}>金重</Text>
                        <Text style={styles.value}>{item.goldWeight}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.label}>石重</Text>
                        <Text style={styles.value}>{item.stoneWeight}</Text>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>驳回</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>接收</Text>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }

    render() {
        let receiveData = this._getData();
        return (
            <View style={{ flex: 1 }} >
                <View style={styles.title}>
                    <Image style={styles.titleImg} source={require('../../../assets/image/home/check.png')} />
                    <Text style={{ fontSize: 13, color: '#333' }}>待接收在途</Text>
                </View >
                <FlatList style={{ flex: 1 }} data={receiveData} renderItem={this._renderItem} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    detailContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        height: 30,
        width: 65,
        borderWidth: 1,
        borderColor: '#b5b5b5',
        borderRadius: 16,
        justifyContent: 'center',
        margin: 10
    },
    buttonText: {
        textAlign: 'center',
        color: '#333'
    },
    bottomContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentContainer: {
        width: (Dimensions.get('window').width - 30),
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#F5F5F5',
        height: 50,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 12,
        color: '#333',
        marginTop: 5
    },
    value: {
        fontSize: 12,
        color: '#666',
        marginTop: 5
    },
    split: {
        width: (Dimensions.get('window').width - 30),
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        borderTopWidth: 2,
        borderColor: '#f3f3f1'
    },
    title: {
        height: 30,
        marginTop: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleImg: {
        height: 20,
        width: 20,
        margin: 10,
        marginLeft: 20
    },
    itemContainer: {
        height: 280,
        backgroundColor: '#fff',
        marginTop: 10
    }
});