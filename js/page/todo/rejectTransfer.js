'use strict';
import React from 'react';
import PageComponent from '../PageComponent';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { callService, handleResult } from '../../utils/service';

export default class RejectReceive extends PageComponent {

    constructor(props) {
        super(props);
        this.backRoute = 'Todo';
        this.state = {
            todoList: []
        };
    }

    queryTodoList() {
        let params = new FormData();
        params.append("todoType", 4);
        callService(this, 'getMyTodoList.do', params, function (response) {
            if (response.todo4List) {
                this.setState({
                    todoList: handleResult(response.todo4List)
                });
            }
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.queryTodoList();
    }

    _renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <View style={{ marginLeft: 20, flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{ fontSize: 14, color: '#333' }}>单号：</Text>
                    <Text style={{ fontSize: 14, color: '#333' }}>{item.sheetNo}</Text>
                </View>
                <View style={styles.split}></View>
                <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
                    <View style={styles.reject}>
                        <Text style={{ fontSize: 19, color: '#F27979' }}>驳回</Text>
                    </View>
                </View>
                <View style={{ height: 120, marginLeft: 20, marginTop: 5 }}>
                    <Text style={styles.label}>发出门店  <Text style={styles.value}>{item.deptAreaName}</Text></Text>
                    <Text style={styles.label}>发出柜台  <Text style={styles.value}>{item.storeName}</Text></Text>
                    <Text style={styles.label}>发出时间  <Text style={styles.value}>{item.outTime}</Text></Text>
                    <Text style={styles.label}>接收门店  <Text style={styles.value}>{item.deptAreaName2}</Text></Text>
                    <Text style={styles.label}>接收柜台  <Text style={styles.value}>{item.storeName2}</Text></Text>
                </View>
                <View style={styles.outContainer}>
                    <View style={styles.contentContainer}>
                        <View style={styles.detailContainer}>
                            <Text style={styles.label}>数量</Text>
                            <Text style={styles.value}>{item.num}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={styles.label}>标价金额</Text>
                            <Text style={[styles.value, { color: 'orange' }]}>{item.salePrice}</Text>
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
                        <Text style={styles.value}>{item.remarks}</Text>
                    </View>
                </View>
            </View >
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <View style={styles.title}>
                    <Image style={styles.titleImg} source={require('../../../assets/image/todo/rejectTransfer.png')} />
                    <Text style={{ fontSize: 13, color: '#333' }}>调拨驳回</Text>
                </View >
                <FlatList style={{ flex: 1 }} data={this.state.todoList} renderItem={this._renderItem} />
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
        marginTop: 10,
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