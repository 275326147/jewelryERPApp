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
import DataTable from '../../components/dataTable';
import data from './data';

export default class Center extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            deptVisible: false,
            storeVisible: false,
            data: data,
            list: [],
            deptList: [{
                key: 1,
                name: '周百福梅州店',
                hidden: false
            }, {
                key: 2,
                name: '梦金园',
                hidden: false
            }, {
                key: 3,
                name: '演示一店',
                hidden: false
            }],
            storeList: [{
                key: 1,
                name: 'K金柜台',
                hidden: false
            }, {
                key: 2,
                name: '玉器柜台',
                hidden: false
            }, {
                key: 3,
                name: '钻石柜台',
                hidden: false
            }, {
                key: 4,
                name: '黄金柜台',
                hidden: false
            }, {
                key: 5,
                name: '铂金柜台',
                hidden: false
            }],
            fields: [{
                key: 1,
                id: 'deptAreaName',
                label: '门店',
                width: 100,
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
                width: 100,
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

    itemClick(item) {
        let list = [];
        let newData = [];
        this.state.list.forEach(function (el) {
            if (el.id === item.id) {
                el.hidden = !el.hidden;
            }
            if (el.id !== 'all' && item.id === 'all' && !item.hidden) {
                el.hidden = false;
            } else if (el.id !== 'all' && item.id === 'all' && item.hidden) {
                el.hidden = true;
            }
            list.push(el);
        });
        data.forEach(function (item) {
            newData.push(item);
        });
        this.setState({
            list: list,
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
        <TouchableWithoutFeedback onPress={() => { this.itemClick(item); }}>
            <View style={[styles.itemContainer, { width: 120, backgroundColor: item.hidden ? '#f3f3f1' : '#6334E6' }]}>
                <Text style={[styles.item, { color: item.hidden ? '#666' : '#fff' }]}>{item.name}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    _renderDeptItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this.itemClick(item); }}>
            <View style={[styles.itemContainer, { width: 120, backgroundColor: item.hidden ? '#f3f3f1' : '#6334E6' }]}>
                <Text style={[styles.item, { color: item.hidden ? '#666' : '#fff' }]}>{item.name}</Text>
            </View>
        </TouchableWithoutFeedback>
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

    showDept() {
        this.setState({
            deptVisible: true
        });
    }

    showStore() {
        this.setState({
            storeVisible: true
        });
    }

    filter(row, rowId) {

        return true;
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
                    <TouchableOpacity style={styles.button} onPress={() => { this.showDept() }}>
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
                <DataTable
                    filter={this.filter}
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
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
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