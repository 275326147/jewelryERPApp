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
import DatePicker from 'react-native-datepicker';
import Datatable from '../../components/datatable/datatable';
import ModalDropdown from '../../components/dropdown/ModalDropdown';
import { callService, handleResult } from '../../utils/service';
import { clickHandler, getShopList, show, getDate, setDate } from './common';

export default class Center extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: getDate(new Date()),
            active: 1,
            detailVisible: false,
            deptVisible: false,
            dateVisible: false,
            data: [],
            materialData: [],
            paymentData: [],
            row: {},
            deptList: [],
            fields: [{
                key: 1,
                id: 'goodsClassify',
                label: '名称'
            }, {
                key: 2,
                id: 'calculateType',
                label: '方式'
            }, {
                key: 3,
                id: 'saleNum',
                label: '件数'
            }, {
                key: 4,
                id: 'labelPrice',
                label: '标价'
            }, {
                key: 5,
                id: 'saleGoldWeight',
                label: '金重'
            }, {
                key: 6,
                id: 'settleTotalMoney',
                label: '实收'
            }]
        };
    }

    materialFields = [{
        key: 1,
        id: 'goodsName',
        label: '商品名称'
    }, {
        key: 2,
        id: 'calculateType',
        label: '类型'
    }, {
        key: 3,
        id: 'netGoldWeight',
        label: '净金重'
    }, {
        key: 4,
        id: 'worksFeeTotal',
        label: '工费'
    }, {
        key: 5,
        id: 'totalMoney',
        label: '回收金额'
    }]

    paymentFields = [{
        key: 1,
        id: 'settleType',
        label: '收款方式',
        width: Dimensions.get('screen').width / 2
    }, {
        key: 2,
        id: 'totalMoney',
        label: '金额',
        width: Dimensions.get('screen').width / 2
    }]

    queryDailyData() {
        let shopAreaCode = [];
        this.state.deptList.forEach(function (item) {
            if (!item.hidden && item.areaCode) {
                shopAreaCode.push(item.areaCode);
            }
        });
        let params = new FormData();
        params.append("shopAreaCode", shopAreaCode.join(','));
        params.append("groupField", this.state.groupField || 'goodsClassify');
        params.append("beginDate", this.state.beginDate || this.state.date);
        params.append("endDate", this.state.endDate || this.state.date);
        callService(this, 'getDailyReportData.do', params, function (response) {
            if (response) {
                this.setState({
                    data: handleResult(response.dailyReportData),
                    materialData: handleResult(response.materialSummaryData),
                    paymentData: handleResult(response.paymentMainData)
                });
            }
        });
    }

    componentDidMount() {
        getShopList(this, function () {
            this.queryDailyData();
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

    _onDateClose() {
        this.setState({
            dateVisible: false
        });
    }

    _onDateSave() {
        if (!this.state.beginDate || !this.state.endDate) return;
        this.setState({
            date: `${this.state.beginDate}至${this.state.endDate}`
        });
        this.queryDailyData();
        this._onDateClose();
    }

    deptClick(item) {
        let deptList = clickHandler(item, this.state.deptList, 'shopName');
        this.setState({
            deptList: deptList
        }, function () {
            this.queryDailyData();
        });
    }

    rowClick(row, rowId) {
        if (this.state.active === 3) {
            return;
        }
        this.setState({
            row: row.item,
            detailVisible: true
        });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Modal
                    visible={this.state.dateVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onDateClose()}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.modalContainer, { width: 250, height: 200 }]}>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>请选择日期</Text>
                            </View>
                            <DatePicker
                                style={{ width: 200, marginTop: 10 }}
                                date={this.state.beginDate}
                                mode="date"
                                placeholder="请选择日期"
                                format="YYYY-MM-DD"
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                onDateChange={(date) => { this.setState({ beginDate: date }) }}
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>至</Text>
                            </View>
                            <DatePicker
                                style={{ width: 200 }}
                                date={this.state.endDate}
                                mode="date"
                                placeholder="请选择日期"
                                format="YYYY-MM-DD"
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                onDateChange={(date) => { this.setState({ endDate: date }) }}
                            />
                            <View style={{ height: 45, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 5, marginTop: 5 }}>
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#6334E6', borderRadius: 18, height: 30, width: 90 }]} onPress={() => { this._onDateSave() }}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 14 }}>确定</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#f3f3f1', borderRadius: 18, height: 30, width: 90 }]} onPress={() => { this._onDateClose() }}>
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
                    visible={this.state.detailVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onDetailClose()}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.modalContainer, { height: 300, width: (Dimensions.get('window').width - 40) }]}>
                            <View style={{ height: 20, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>日报详情</Text></View>
                            <FlatList style={{ flex: 1 }} data={this.state.active === 1 ? this.state.fields : this.materialFields} renderItem={this._renderDetailItem} />
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
                                this.queryDailyData();
                            });
                        }
                    } />
                    <TouchableOpacity style={styles.button} onPress={() => { show(this, 'deptList', 'shopName', 'deptVisible'); }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../../assets/image/storage/filter.png')} />
                        <Text style={styles.text}>门店</Text>
                    </TouchableOpacity>
                    {
                        this.state.active === 1 ?
                            <ModalDropdown options={['实际分类', '商品名称', '门店', '柜台']} onSelect={
                                (rowID, rowData) => {
                                    let groupField = '';
                                    switch (rowID) {
                                        case '0':
                                            groupField = 'goodsClassify';
                                            break;
                                        case '1':
                                            groupField = 'goodsName';
                                            break;
                                        case '2':
                                            groupField = 'deptAreaName';
                                            break;
                                        case '3':
                                            groupField = 'storeName';
                                            break;
                                    }
                                    this.setState({
                                        groupField: groupField
                                    }, function () {
                                        this.queryDailyData();
                                    });
                                }
                            } />
                            : <View />
                    }
                </View>
                <View style={styles.tabbar}>
                    <TouchableWithoutFeedback onPress={() => { this.setState({ active: 1 }) }}>
                        <View style={[styles.tab, this.state.active === 1 ? styles.active : {}]}>
                            <Text style={styles.tabText}>营业汇总</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { this.setState({ active: 2 }) }}>
                        <View style={[styles.tab, this.state.active === 2 ? styles.active : {}]}>
                            <Text style={styles.tabText}>旧料汇总</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { this.setState({ active: 3 }) }}>
                        <View style={[styles.tab, this.state.active === 3 ? styles.active : {}]}>
                            <Text style={styles.tabText}>支付方式汇总</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {
                    this.state.active === 1 ?
                        <Datatable
                            rowClick={this.rowClick.bind(this)}
                            dataSource={this.state.data}
                            fields={this.state.fields} />
                        : <View />
                }
                {
                    this.state.active === 2 ?
                        <Datatable
                            rowClick={this.rowClick.bind(this)}
                            dataSource={this.state.materialData}
                            fields={this.materialFields} />
                        : <View />
                }
                {
                    this.state.active === 3 ?
                        <Datatable
                            rowClick={this.rowClick.bind(this)}
                            dataSource={this.state.paymentData}
                            fields={this.paymentFields} />
                        : <View />
                }
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
    textContainer: {
        width: 250,
        height: 20,
        backgroundColor: '#fff',
        marginTop: 5
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