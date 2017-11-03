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
import { clickHandler, getShopList, show, getDate, setDate } from './common';
import { callService, handleResult } from '../../utils/service';

export default class Center extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: getDate(new Date()),
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
                id: 'rowId',
                label: '编号'
            }, {
                key: 2,
                id: 'deptAreaName',
                label: '门店'
            }, {
                key: 3,
                id: 'showName',
                label: '名称'
            }, {
                key: 4,
                id: 'saleNum',
                label: '数量'
            }, {
                key: 5,
                id: 'saleGoldWeight',
                label: '金重'
            }, {
                key: 6,
                id: 'labelPrice',
                label: '标价'
            }, {
                key: 7,
                id: 'settleTotalMoney',
                label: '售价'
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
        params.append("groupField", this.state.groupField || 'goodsClassify');
        params.append("shopAreaCode", shopAreaCode.join(','));
        params.append("beginDate", this.state.beginDate || this.state.date);
        params.append("endDate", this.state.endDate || this.state.date);
        callService(this, 'getSaleTopData.do', params, function (response) {
            if (response.saleTopData) {
                let data = [];
                response.saleTopData.forEach(function (item) {
                    let deptAreaName = item[0].deptAreaName;
                    data.push({ rowId: deptAreaName, disableClick: true });
                    let rowId = 1;
                    item.forEach(function (el) {
                        if (el.showName === '小计') {
                            el.disableClick = true;
                            el.textStyle = { 'color': 'orange' };
                            return;
                        }
                        el.rowId = rowId++;
                    });
                    data = data.concat(item);
                });
                this.setState({
                    data: handleResult(data)
                });
            }
        });
    }

    componentDidMount() {
        getShopList(this, function () {
            this.querySaleTopData();
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

    rowClick(row, rowId) {
        this.setState({
            row: row.item,
            detailVisible: true
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
                            setDate(this, rowID, function () {
                                this.querySaleTopData();
                            });
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
                                case '0':
                                    groupField = 'goodsClassify';
                                    break;
                                case '1':
                                    groupField = 'costClassify';
                                    break;
                                case '2':
                                    groupField = 'statsClassify';
                                    break;
                                case '3':
                                    groupField = 'mainType';
                                    break;
                            }
                            this.setState({
                                groupField: groupField
                            }, function () {
                                this.querySaleTopData();
                            });
                        }
                    } />
                </View>
                <Datatable
                    disableAltRow={true}
                    rowClick={this.rowClick.bind(this)}
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