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
    TouchableWithoutFeedback,
    TextInput
} from 'react-native';
import Datatable from '../../components/datatable/datatable';
import ModalDropdown from '../../components/dropdown/ModalDropdown';
import { reloadTable, getShopList } from '../report/common';
import { callService, handleResult } from '../../utils/service';
import { deepClone } from '../../utils/common';

export default class Price extends PageComponent {

    constructor(props) {
        super(props);
        this.backRoute = 'Home';
        this.state = {
            detailVisible: false,
            deptList: [],
            brandList: [],
            data: [],
            row: {},
            fields: [/*{
                key: 1,
                id: 'shopName',
                label: '门店名称',
                sortable: true
            }, {
                key: 2,
                id: 'brandName',
                label: '品牌名称',
                sortable: true
            },*/ {
                    key: 3,
                    id: 'goodsName',
                    label: '商品分类',
                    sortable: true
                }, {
                    key: 4,
                    id: 'minPrice',
                    label: '最低价格(克)',
                    editable: true,
                    width: 120,
                    sortable: true
                }, {
                    key: 5,
                    id: 'minDiscount',
                    label: '最低折扣',
                    editable: true,
                    sortable: true
                }, {
                    key: 6,
                    id: 'currentPrice',
                    label: '今日价格(克)',
                    editable: true,
                    width: 120,
                    sortable: true
                }, {
                    key: 7,
                    id: 'currentDiscount',
                    editable: true,
                    label: '今日折扣',
                    sortable: true
                }]
        };
    }

    queryPriceList() {
        let params = new FormData();
        params.append("shopId", this.state.shopId);
        params.append("brandId", this.state.brandId);
        callService(this, 'getSalePriceList.do', params, function (response) {
            if (response.salePriceList) {
                this.setState({
                    data: handleResult(response.salePriceList)
                });
            }
        });
    }

    componentDidMount() {
        super.componentDidMount();
        getShopList(this, function () {
            this.setState({
                shopId: this.state.deptList[0].id
            });
            callService(this, 'getBrandList.do', new FormData(), function (response) {
                if (response.brandList && response.brandList.length > 0) {
                    this.setState({
                        brandId: response.brandList[0].id,
                        brandList: handleResult(response.brandList)
                    }, function () {
                        this.queryPriceList();
                    });
                }
            });
        });
    }

    _renderDetailItem = ({ item }) => (
        <View style={{ width: 280, height: 35, flexDirection: 'row' }}>
            <Text style={{ flex: 1, textAlign: 'left', fontSize: 14, color: '#999', marginLeft: 40 }}>{item.label}</Text>
            {
                item.editable ?
                    <TextInput style={{ flex: 1, marginRight: 20, fontSize: 14, height: 30, padding: 0, paddingLeft: 10, width: 40, backgroundColor: '#f3f3f1' }}
                        onChangeText={(text) => {
                            let newRow = deepClone(this.state.row);
                            newRow[item.id] = text;
                            this.setState({
                                row: newRow
                            });
                        }}
                        value={this.state.row[item.id].toString()}
                        keyboardType='numeric'
                        underlineColorAndroid="transparent">
                    </TextInput>
                    :
                    <Text style={{ flex: 1, textAlign: 'left', fontSize: 14, color: '#333' }}>{this.state.row[item.id]}</Text>
            }
        </View>
    );

    _onDetailSave() {
        let params = new FormData();
        params.append("id", this.state.row.id || "");
        params.append("currentPrice", this.state.row.currentPrice);
        params.append("currentDiscount", this.state.row.currentDiscount);
        params.append("minPrice", this.state.row.minPrice);
        params.append("minDiscount", this.state.row.minDiscount);
        params.append("goodsId", this.state.row.goodsId);
        params.append("shopId", this.state.row.shopId);
        params.append("brandId", this.state.row.brandId);
        callService(this, 'updateSalePrice.do', params, function (response) {
            this.queryPriceList();
            this._onDetailClose();
        });
    }

    _onDetailClose() {
        this.setState({
            detailVisible: false
        });
    }

    rowClick(row, rowId) {
        this.setState({
            row: row.item,
            detailVisible: true
        });
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
                <Modal
                    visible={this.state.detailVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onDetailClose()}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <View style={{ height: 20, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>牌价详情</Text></View>
                            <FlatList style={{ flex: 1 }} data={this.state.fields} renderItem={this._renderDetailItem} />
                            <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 5 }}>
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#6334E6', borderRadius: 18, height: 30, width: 120 }]} onPress={() => { this._onDetailSave() }}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 14 }}>保存</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#f3f3f1', borderRadius: 18, height: 30, width: 120 }]} onPress={() => { this._onDetailClose() }}>
                                    <Text style={{ textAlign: 'center', color: '#666', fontSize: 14 }}>关闭</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={styles.toolbar}>
                    <Text style={{ fontSize: 14, color: '#333' }}>门店：</Text>
                    <ModalDropdown options={this.state.deptList} field="shopName" onSelect={
                        (rowID, rowData) => {
                            this.setState({
                                shopId: rowData.id
                            }, function () {
                                this.queryPriceList();
                            });
                        }
                    } />
                    <Text style={{ fontSize: 14, color: '#333', marginLeft: 20 }}>品牌：</Text>
                    <ModalDropdown options={this.state.brandList} field="name" onSelect={
                        (rowID, rowData) => {
                            this.setState({
                                brandId: rowData.id
                            }, function () {
                                this.queryPriceList();
                            });
                        }
                    } />
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
    modalContainer: {
        backgroundColor: '#fff',
        width: 280,
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
    }
});