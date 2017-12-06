/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React from 'react';
import PageComponent from '../PageComponent';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
    Modal,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';
import Spinner from '../../components/loading/loading';
import Datatable from '../../components/datatable/datatable';
import { clickHandler, getShopList, show, reloadTable } from '../report/common';
import { callService, handleResult } from '../../utils/service';
import { unlockScreen } from '../../utils/common';

export default class Storage extends PageComponent {

    constructor(props) {
        super(props);
        this.backRoute = 'Home';
        this.state = {
            loading: false,
            modalVisible: false,
            deptVisible: false,
            storeVisible: false,
            detailVisible: false,
            data: [],
            list: [],
            row: {},
            deptList: [],
            storeList: [],
            originStoreList: [],
            fields: [{
                key: 1,
                id: 'deptAreaName',
                label: '门店',
                sortable: true
            }, {
                key: 2,
                id: 'storeName',
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
                id: 'statsClassify',
                label: '统计分类',
                sortable: true,
                hidden: true
            }, {
                key: 6,
                id: 'archivesCategory',
                label: '品类',
                sortable: true,
                hidden: true
            }, {
                key: 7,
                id: 'num',
                label: '数量',
                sortable: true
            }, {
                key: 8,
                id: 'totalGoldWeight',
                label: '金重',
                sortable: true
            }, {
                key: 9,
                id: 'labelMoney',
                label: '标价',
                sortable: true
            }]
        };
    }

    queryGoodsList() {
        let shopAreaCode = [];
        this.state.deptList.forEach(function (item) {
            if (!item.hidden && item.areaCode) {
                shopAreaCode.push(item.areaCode);
            }
        });
        let storeId = [];
        this.state.storeList.forEach(function (item) {
            if (!item.hidden && item.id) {
                storeId.push(item.id);
            }
        });
        let groupField = [];
        this.state.list.forEach(function (item) {
            if (!item.hidden && item.id) {
                groupField.push(item.id);
            }
        });
        let params = new FormData();
        params.append("storeId", storeId.join(','));
        params.append("groupField", groupField.join(','));
        params.append("shopAreaCode", shopAreaCode.join(','));
        this.setState({
            loading: true
        }, function () {
            callService(this, 'getGoodsStockSummary.do', params, function (response) {
                if (response.stockList) {
                    this.setState({
                        data: handleResult(response.stockList)
                    });
                }
                unlockScreen(this);
            }, function () {
                unlockScreen(this);
            });
        });
    }

    filterStore(data, deptList) {
        let storeList = [];
        data.forEach(function (store) {
            deptList.forEach(function (dept) {
                if (!dept.hidden && store.areaCode && store.areaCode.indexOf(dept.areaCode) > -1) {
                    storeList.push(store);
                }
            });
        });
        return handleResult(storeList);
    }

    componentDidMount() {
        super.componentDidMount('库存汇总');
        getShopList(this, function () {
            let areaCode = [];
            let param = new FormData();
            this.state.deptList.forEach(function (item) {
                areaCode.push(item.areaCode);
            });
            param.append('areaCode', areaCode.join(','));
            callService(this, 'getStoreList.do', param, function (response) {
                let storeList = response.storeList;
                if (response.storeList) {
                    this.setState({
                        storeList: handleResult(storeList),
                        originStoreList: storeList
                    });
                }
            });
        });
        this.setState({
            list: this.state.fields.slice(0, 6)
        }, function () {
            this.queryGoodsList();
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    itemClick(item) {
        let list = clickHandler(item, this.state.list, 'label');
        this.setState({
            list: list
        });
    }

    deptClick(item) {
        let deptList = clickHandler(item, this.state.deptList, 'shopName');
        this.setState({
            deptList: deptList,
            storeList: this.filterStore(this.state.originStoreList, deptList)
        });
    }

    storeClick(item) {
        let storeList = clickHandler(item, this.state.storeList, 'storeName');
        this.setState({
            storeList: storeList
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
        item.hidden ? <View /> :
            <View style={{ width: 280, height: 25, flexDirection: 'row' }}>
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

    rowClick(row, rowId) {
        if (!this.state.loading) {
            this.setState({
                row: row.item,
                detailVisible: true
            });
        }
    }

    onSort(field, isAscending) {
        let sortedData = this.state.data.sort((objA, objB) => this.compare(field, isAscending, objA, objB));
        reloadTable(this, sortedData);
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
                <Spinner visible={this.state.loading} textContent={""} textStyle={{ color: '#FFF' }} />
                <Modal
                    visible={this.state.detailVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onDetailClose()}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.modalContainer, { height: 300 }]}>
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
                        <View style={[styles.modalContainer, { height: 260 }]}>
                            <View style={{ height: 20, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>请选择分组设置</Text></View>
                            <FlatList style={{ flex: 1 }} data={this.state.list} renderItem={this._renderItem} horizontal={false} numColumns={3} />
                            <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 5 }}>
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#6334E6', borderRadius: 18, height: 30, width: 120 }]} onPress={() => { this.setState({ modalVisible: false }, function () { this.queryGoodsList() }); }}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 14 }}>确定</Text>
                                </TouchableOpacity>
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
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#6334E6', borderRadius: 18, height: 30, width: 120 }]} onPress={() => { this.setState({ deptVisible: false }, function () { this.queryGoodsList() }); }}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 14 }}>确定</Text>
                                </TouchableOpacity>
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
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#6334E6', borderRadius: 18, height: 30, width: 120 }]} onPress={() => { this.setState({ storeVisible: false }, function () { this.queryGoodsList() }); }}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 14 }}>确定</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#f3f3f1', borderRadius: 18, height: 30, width: 120 }]} onPress={() => { this._onStoreClose() }}>
                                    <Text style={{ textAlign: 'center', color: '#666', fontSize: 14 }}>关闭</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.button} onPress={() => { show(this, 'deptList', 'shopName', 'deptVisible') }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../../assets/image/storage/filter.png')} />
                        <Text style={styles.text}>门店</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { show(this, 'storeList', 'storeName', 'storeVisible') }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../../assets/image/storage/filter.png')} />
                        <Text style={styles.text}>柜台</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { show(this, 'list', 'label', 'modalVisible', true) }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../../assets/image/storage/filter.png')} />
                        <Text style={styles.text}>分组设置</Text>
                    </TouchableOpacity>
                </View>
                <Datatable
                    onSort={this.onSort.bind(this)}
                    rowClick={this.rowClick.bind(this)}
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
        width: 300,
        height: 320,
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
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        margin: 10,
        height: 35,
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