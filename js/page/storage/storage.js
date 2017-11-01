/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    Dimensions,
    Modal,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import Datatable from '../../components/datatable/datatable';
import { clickHandler, getShopList, showDept } from '../report/common';
import { callService, handleResult } from '../../utils/service';
import data from './data';

export default class Center extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            deptVisible: false,
            storeVisible: false,
            detailVisible: false,
            data: data,
            list: [],
            row: {},
            deptList: [],
            storeList: [],
            fields: [{
                key: 1,
                id: 'deptAreaName',
                label: '门店',
                sortable: true
            }, {
                key: 2,
                id: 'store',
                label: '柜台',
                sortable: true,
                hidden: true
            }, {
                key: 3,
                id: 'goodsName',
                label: '商品名称',
                sortable: true,
                hidden: true
            }, {
                key: 4,
                id: 'goodsClassify',
                label: '实际分类',
                sortable: true
            }, {
                key: 5,
                id: 'supplierName',
                label: '供应商',
                sortable: true,
                hidden: true
            }, {
                key: 6,
                id: 'statisticsClassify',
                label: '统计分类',
                sortable: true,
                hidden: true
            }, {
                key: 7,
                id: 'model',
                label: '核算模式',
                sortable: true,
                hidden: true
            }, {
                key: 8,
                id: 'classify',
                label: '品类',
                sortable: true,
                hidden: true
            }, {
                key: 9,
                id: 'num',
                label: '数量',
                sortable: true
            }, {
                key: 10,
                id: 'goldWeight',
                label: '金重',
                sortable: true
            }, {
                key: 11,
                id: 'price',
                label: '标价',
                sortable: true
            }]
        };
    }

    componentDidMount() {
        getShopList(this);
        callService(this, 'getStoreList.do', new FormData(), function (response) {
            if (response.storeList) {
                this.setState({
                    storeList: handleResult(response.storeList)
                });
            }
        });
    }

    itemClick(item) {
        let list = clickHandler(item, this.state.list);
        this.setState({
            list: list
        });
        this.reloadTable();
    }

    deptClick(item) {
        let deptList = clickHandler(item, this.state.deptList);
        this.setState({
            deptList: deptList
        });
        this.reloadTable();
    }

    storeClick(item) {
        let storeList = clickHandler(item, this.state.storeList, 'storeName');
        this.setState({
            storeList: storeList
        });
        this.reloadTable();
    }

    reloadTable(data) {
        if (!data) data = this.state.data;
        let newData = [];
        data.forEach(function (item) {
            newData.push(item);
        });
        this.setState({
            data: newData
        });
    }

    _renderItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this.itemClick(item); }}>
            <View style={[styles.itemContainer, { backgroundColor: item.hidden ? '#f3f3f1' : '#6334E6' }]}>
                <Text style={[styles.item, { color: item.hidden ? '#666' : '#fff' }]}>{item.label}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    _renderStoreItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this.storeClick(item); }}>
            <View style={[styles.itemContainer, { width: 120, backgroundColor: item.hidden ? '#f3f3f1' : '#6334E6' }]}>
                <Text style={[styles.item, { color: item.hidden ? '#666' : '#fff' }]}>{item.storeName}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    _renderDeptItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this.deptClick(item); }}>
            <View style={[styles.itemContainer, { width: 120, backgroundColor: item.hidden ? '#f3f3f1' : '#6334E6' }]}>
                <Text style={[styles.item, { color: item.hidden ? '#666' : '#fff' }]}>{item.shopName}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    _renderDetailItem = ({ item }) => (
        <View style={{ width: (Dimensions.get('window').width - 40), height: 25, flexDirection: 'row' }}>
            <Text style={{ flex: 1, textAlign: 'left', fontSize: 14, color: '#999', marginLeft: 40 }}>{item.label}</Text>
            <Text style={{ flex: 2, textAlign: 'left', fontSize: 14, color: '#333' }}>{this.state.row[item.id]}</Text>
        </View>
    );

    _onClose() {
        this.setState({
            modalVisible: false
        });
    }

    _onStoreClose() {
        this.setState({
            storeVisible: false
        });
    }

    _onDeptClose() {
        this.setState({
            deptVisible: false
        });
    }

    _onDetailClose() {
        this.setState({
            detailVisible: false
        });
    }

    showGroup() {
        if (this.state.list.length === 0) {
            this.setState({
                list: [{
                    key: 0,
                    id: 'all',
                    label: '全部',
                    hidden: true
                }].concat(this.state.fields.slice(0, 8)),
                modalVisible: true
            });
            return;
        }
        this.setState({
            modalVisible: true
        });
    }

    showStore() {
        if (this.state.storeList[0].storeName !== '全部') {
            this.setState({
                storeList: [{
                    key: 0,
                    storeName: '全部',
                    hidden: false
                }].concat(this.state.storeList),
                storeVisible: true
            });
            return;
        }
        this.setState({
            storeVisible: true
        });
    }

    filter(row, rowId) {
        let flag = true;
        this.state.deptList.forEach(function (item) {
            if (item.hidden && item.label === row.item.deptAreaName) {
                flag = false;
            }
        });
        this.state.storeList.forEach(function (item) {
            if (item.hidden && item.label === row.item.store) {
                flag = false;
            }
        });
        return flag;
    }

    rowClick(row, rowId) {
        this.setState({
            row: row.item,
            detailVisible: true
        });
    }

    onSort(field, isAscending) {
        let sortedData = this.state.data.sort((objA, objB) => this.compare(field, isAscending, objA, objB));
        this.reloadTable(sortedData);
    }

    compare(field, isAscending, objA, objB) {
        var key = field.id;

        if (isAscending) {
            if (objA[key] < objB[key])
                return -1;
            if (objA[key] > objB[key])
                return 1;
            return 0;
        } else {
            if (objA[key] > objB[key])
                return -1;
            if (objA[key] < objB[key])
                return 1;
            return 0;
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Modal
                    visible={this.state.detailVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onDetailClose()}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.modalContainer, { height: 360, width: (Dimensions.get('window').width - 40) }]}>
                            <View style={{ height: 20, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>库存详情</Text></View>
                            <FlatList style={{ flex: 1 }} data={this.state.fields} renderItem={this._renderDetailItem} />
                            <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 5 }}>
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#f3f3f1', borderRadius: 18, height: 30, width: 120 }]} onPress={() => { this._onDetailClose() }}>
                                    <Text style={{ textAlign: 'center', color: '#666', fontSize: 14 }}>关闭</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.modalVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onClose()}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <View style={{ height: 20, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>请选择分组设置</Text></View>
                            <FlatList style={{ flex: 1 }} data={this.state.list} renderItem={this._renderItem} horizontal={false} numColumns={3} />
                            <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 5 }}>
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#f3f3f1', borderRadius: 18, height: 30, width: 120 }]} onPress={() => { this._onClose() }}>
                                    <Text style={{ textAlign: 'center', color: '#666', fontSize: 14 }}>关闭</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.deptVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onDeptClose()}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <View style={{ height: 20, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>请选择门店</Text></View>
                            <FlatList style={{ flex: 1 }} data={this.state.deptList} renderItem={this._renderDeptItem} horizontal={false} numColumns={2} />
                            <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 5 }}>
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#f3f3f1', borderRadius: 18, height: 30, width: 120 }]} onPress={() => { this._onDeptClose() }}>
                                    <Text style={{ textAlign: 'center', color: '#666', fontSize: 14 }}>关闭</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.storeVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onStoreClose()}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <View style={{ height: 20, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>请选择柜台</Text></View>
                            <FlatList style={{ flex: 1 }} data={this.state.storeList} renderItem={this._renderStoreItem} horizontal={false} numColumns={2} />
                            <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 5 }}>
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#f3f3f1', borderRadius: 18, height: 30, width: 120 }]} onPress={() => { this._onStoreClose() }}>
                                    <Text style={{ textAlign: 'center', color: '#666', fontSize: 14 }}>关闭</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.button} onPress={() => { showDept(this) }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../../assets/image/storage/filter.png')} />
                        <Text style={styles.text}>门店</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { this.showStore() }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../../assets/image/storage/filter.png')} />
                        <Text style={styles.text}>柜台</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { this.showGroup() }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../../assets/image/storage/filter.png')} />
                        <Text style={styles.text}>分组设置</Text>
                    </TouchableOpacity>
                </View>
                <Datatable
                    onSort={this.onSort.bind(this)}
                    rowClick={this.rowClick.bind(this)}
                    filter={this.filter.bind(this)}
                    dataSource={this.state.data}
                    fields={this.state.fields} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        margin: 10,
        width: 80,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    item: {
        fontSize: 14,
        textAlign: 'center'
    },
    modalContainer: {
        backgroundColor: '#fff',
        width: (Dimensions.get('window').width - 20),
        height: 280,
        borderRadius: 4,
        alignItems: 'center'
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    toolbar: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        margin: 10,
        height: 40,
        width: 85,
        borderWidth: 1,
        borderColor: '#f3f3f1',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#333',
        fontSize: 14,
        textAlign: 'center'
    }
});