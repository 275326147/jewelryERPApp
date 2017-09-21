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
import data from './approveData';

export default class RejectApprove extends Component {
    typeMap = {
        1: {
            color: '#ACC2FA',
            label: '进货单'
        },
        2: {
            color: '#93D987',
            label: '调拨单'
        },
        3: {
            color: '#7AD8C5',
            label: '调价单'
        }
    }

    _getData() {
        let filterData = [];
        data.forEach(function (item) {
            if (item.status === 2) {
                filterData.push(item);
            }
        });
        return filterData;
    }

    _renderItem = ({ item }) => {
        let color = this.typeMap[item.type] ? this.typeMap[item.type]['color'] : '#EBC77D';
        let label = this.typeMap[item.type] ? this.typeMap[item.type]['label'] : '未知单';
        return (
            <View style={styles.itemContainer}>
                <View style={{ height: 20, marginLeft: 10, marginTop: 5 }}>
                    <View style={{ height: 16, width: 45, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 10, color: '#fff' }}>{label}</Text>
                    </View>
                </View>
                <View style={{ marginLeft: 20, flexDirection: 'row', marginTop: 5 }}>
                    <Text style={{ fontSize: 14, color: '#333' }}>单号：</Text>
                    <Text style={{ fontSize: 14, color: '#333' }}>{item.no}</Text>
                </View>
                <View style={[styles.split, { alignItems: 'flex-end' }]}>
                    <View style={styles.reject}>
                        <Text style={{ fontSize: 19, color: '#F27979' }}>驳回</Text>
                    </View>
                </View>
                <View style={{ height: 100, marginLeft: 20, marginTop: 5 }}>
                    <Text style={styles.label}>提交人  <Text style={styles.value}>{item.creator}</Text></Text>
                    <Text style={styles.label}>提交时间  <Text style={styles.value}>{item.createDate}</Text></Text>
                    <Text style={styles.label}>审核人  <Text style={styles.value}>{item.approver}</Text></Text>
                    <Text style={styles.label}>审核时间  <Text style={styles.value}>{item.approveDate}</Text></Text>
                </View>
                <View style={styles.outContainer}>
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
                            <Text style={styles.value}>{item.goldWeight}g</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={styles.label}>石重</Text>
                            <Text style={styles.value}>{item.stoneWeight}g</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: 30, marginLeft: 10, marginTop: 5 }}>
                        <Text style={styles.label}>审批意见：</Text>
                        <Text style={styles.value}>{item.remark}</Text>
                    </View>
                </View>
            </View >
        );
    }

    render() {
        let receiveData = this._getData();
        return (
            <View style={{ flex: 1 }} >
                <View style={styles.title}>
                    <Image style={styles.titleImg} source={require('../../../assets/image/todo/rejectApprove.png')} />
                    <Text style={{ fontSize: 13, color: '#333' }}>审核驳回</Text>
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
    reject: {
        transform: [{ rotateZ: '-20deg' }],
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -12,
        marginRight: 10,
        backgroundColor: 'transparent',
        height: 25,
        width: 48,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#F27979'
    },
    outContainer: {
        height: 100,
        backgroundColor: '#f5f5f5',
        width: (Dimensions.get('window').width - 30),
        marginLeft: 15,
        marginRight: 15
    },
    contentContainer: {
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#E9E9E9',
        height: 50,
        marginTop: 10,
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
        marginTop: 5,
        borderTopWidth: 2,
        borderColor: '#f3f3f1'
    },
    title: {
        height: 30,
        marginTop: 10,
        marginBottom: 10,
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
        height: 290,
        backgroundColor: '#fff',
        marginBottom: 10
    }
});