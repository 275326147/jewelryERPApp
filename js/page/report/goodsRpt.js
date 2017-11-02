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
    TouchableWithoutFeedback,
    TextInput
} from 'react-native';
import Datatable from '../../components/datatable/datatable';
import ModalDropdown from '../../components/dropdown/ModalDropdown';
import { clickHandler, getShopList, show } from './common';
import { callService, handleResult } from '../../utils/service';

export default class Center extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: this.getDate(new Date()),
            active: 1,
            detailVisible: false,
            deptVisible: false,
            data: [],
            row: {},
            typeList: [{
                key: 1,
                shopName: '素金',
                hidden: false
            }, {
                key: 2,
                shopName: '非素',
                hidden: false
            }],
            deptList: [],
            fields: [{
                key: 1,
                id: 'id',
                label: '编号',
                sortable: true
            }, {
                key: 2,
                id: 'deptAreaName',
                label: '门店',
                sortable: true
            }, {
                key: 3,
                id: 'showName',
                label: '名称',
                sortable: true
            }, {
                key: 4,
                id: 'saleNum',
                label: '数量',
                sortable: true
            }, {
                key: 5,
                id: 'saleGoldWeight',
                label: '金重',
                sortable: true
            }, {
                key: 6,
                id: 'labelPrice',
                label: '标价',
                editable: true,
                sortable: true
            }, {
                key: 7,
                id: 'settleTotalMoney',
                label: '售价',
                sortable: true
            }]
        };
    }

    querySaleTopData() {
        let shopAreaCode = [];
        this.state.deptList.forEach(function (item) {
            if (!item.hidden && item.areaCode) {
                shopAreaCode.push(item.areaCode);
            }
        });
        let statisticsType = 'all';
        if (this.state.typeList[0].hidden && !this.state.typeList[1].hidden) {
            statisticsType = 'notGold';
        } else if (!this.state.typeList[0].hidden && this.state.typeList[1].hidden) {
            statisticsType = 'gold';
        }
        let params = new FormData();
        params.append("statisticsType", statisticsType);
        params.append("groupField", this.state.groupField);
        params.append("shopAreaCode", shopAreaCode.join(','));
        params.append("beginDate", this.state.beginDate);
        params.append("endDate", this.state.endDate);
        callService(this, 'getSaleTopData.do', params, function (response) {
            if (response.saleTopData) {
                this.setState({
                    data: handleResult(response.saleTopData)
                });
            }
        });
    }

    componentDidMount() {
        getShopList(this);
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

    _renderDetailItem = ({ item }) => (
        <View style={{ width: (Dimensions.get('window').width - 40), height: 35, flexDirection: 'row' }}>
            <Text style={{ flex: 1, textAlign: 'left', fontSize: 14, color: '#999', marginLeft: 40 }}>{item.label}</Text>
            <Text style={{ flex: 1, textAlign: 'left', fontSize: 14, color: '#333' }}>{this.state.row[item.id]}</Text>
        </View>
    );

    _renderDeptItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this.deptClick(item); }}>
            <View style={[styles.itemContainer, { width: 120, backgroundColor: item.hidden ? '#f3f3f1' : '#6334E6' }]}>
                <Text style={[styles.item, { color: item.hidden ? '#666' : '#fff' }]}>{item.shopName}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    _onDetailClose() {
        this.setState({
            detailVisible: false
        });
    }

    _onDeptClose() {
        this.setState({
            deptVisible: false
        });
    }

    deptClick(item) {
        let deptList = clickHandler(item, this.state.deptList, 'shopName');
        this.setState({
            deptList: deptList
        });
    }

    filter(row, rowId) {
        let flag = true;

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

    getDate(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10 ? "0".concat(month) : month;
        let day = date.getDate();
        day = day < 10 ? "0".concat(day) : day;
        return `${year}-${month}-${day}`;
    }

    setDate(rowID) {
        let date = new Date();
        let fromDate = '';
        let toDate = '';
        switch (rowID) {
            case '1':
                date = new Date(date.getTime() - 24 * 60 * 60 * 1000);
                date = this.getDate(date);
                fromDate = date;
                toDate = date;
                break;
            case '2':
                fromDate = this.getDate(new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000));
                toDate = this.getDate(date);
                date = `${fromDate}至${toDate}`;
                break;
            case '3':
                fromDate = this.getDate(new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000));
                toDate = this.getDate(date);
                date = `${fromDate}至${toDate}`;
                break;
            case '4':
                break;
            default:
                date = this.getDate(date);
                fromDate = date;
                toDate = date;
                break;
        }
        this.setState({
            date: date,
            fromDate: fromDate,
            toDate: toDate
        });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Modal
                    visible={this.state.deptVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onDeptClose()}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.modalContainer, { height: 340 }]}>
                            <View style={{ height: 10, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>请选择统计类型</Text></View>
                            <View style={{ height: 50 }}>
                                <FlatList data={this.state.typeList} renderItem={this._renderDeptItem} horizontal={false} numColumns={2} />
                            </View>
                            <View style={{ height: 10, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>请选择门店</Text></View>
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
                    visible={this.state.detailVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onDetailClose()}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.modalContainer, { height: 340, width: (Dimensions.get('window').width - 40) }]}>
                            <View style={{ height: 20, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>商品销售详情</Text></View>
                            <FlatList style={{ flex: 1 }} data={this.state.fields} renderItem={this._renderDetailItem} />
                            <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 5 }}>
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#f3f3f1', borderRadius: 18, height: 30, width: 120 }]} onPress={() => { this._onDetailClose() }}>
                                    <Text style={{ textAlign: 'center', color: '#666', fontSize: 14 }}>关闭</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={{ height: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#999' }}>{this.state.date}</Text>
                </View>
                <View style={styles.toolbar}>
                    <ModalDropdown options={['今日', '昨日', '近7天', '近30天', '自定义']} onSelect={
                        (rowID, rowData) => {
                            this.setDate(rowID);
                        }
                    } />
                    <TouchableOpacity style={styles.button} onPress={() => { show(this, 'deptList', 'shopName', 'deptVisible') }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../../assets/image/storage/filter.png')} />
                        <Text style={styles.text}>筛选</Text>
                    </TouchableOpacity>
                    <ModalDropdown options={['实际分类', '成本分类', '统计分类', '核算模式']} onSelect={
                        (rowID, rowData) => {
                            let groupField = '';
                            switch (rowID) {
                                case '实际分类':
                                    groupField = 'goodsClassify';
                                    break;
                                case '成本分类':
                                    groupField = 'costClassify';
                                    break;
                                case '统计分类':
                                    groupField = 'statsClassify';
                                    break;
                                case '核算模式':
                                    groupField = 'mainType';
                                    break;
                            }
                            this.setState({
                                groupField: groupField
                            });
                        }
                    } />
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
    active: {
        borderBottomWidth: 2,
        borderColor: '#6334E6'
    },
    tabbar: {
        flexDirection: 'row',
        height: 40
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#f3f3f1'
    },
    tabText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#6334E6'
    },
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
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        margin: 10,
        height: 32,
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