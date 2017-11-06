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
    TextInput,
    DeviceEventEmitter
} from 'react-native';
import Datatable from '../../components/datatable/datatable';
import ModalDropdown from '../../components/dropdown/ModalDropdown';
import { clickHandler, getShopList, show, getDate, setDate, sort } from './common';
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
            deptList: [],
            empList: [],
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
                id: 'employeeName',
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

    queryEmployeeTopData() {
        let shopAreaCode = [];
        this.state.deptList.forEach(function (item) {
            if (!item.hidden && item.areaCode) {
                shopAreaCode.push(item.areaCode);
            }
        });
        let employeeId = [];
        this.state.empList.forEach(function (item) {
            if (!item.hidden && item.id) {
                employeeId.push(item.id);
            }
        });
        let params = new FormData();
        params.append("shopAreaCode", shopAreaCode.join(','));
        params.append("employeeId", employeeId.join(','));
        params.append("beginDate", this.state.beginDate || this.state.date);
        params.append("endDate", this.state.endDate || this.state.date);
        callService(this, 'getEmployeeTopData.do', params, function (response) {
            let employeeTopData = response.employeeTopData;
            if (employeeTopData) {
                let data = [];
                sort(employeeTopData, 'settleTotalMoney');
                employeeTopData.forEach(function (item) {
                    let deptAreaName = item[0].deptAreaName;
                    data.push({ rowId: deptAreaName, disableClick: true });
                    let rowId = 1;
                    item.forEach(function (el) {
                        if (el.employeeName === '小计') {
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
            callService(this, 'getEmployeeList.do', new FormData(), function (response) {
                if (response.employeeList) {
                    this.setState({
                        empList: handleResult([{
                            name: '全部',
                            hidden: false
                        }].concat(response.employeeList))
                    }, function () {
                        this.queryEmployeeTopData();
                    });
                }
            });
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


    _renderEmpItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this.empClick(item); }}>
            <View style={[styles.itemContainer, { width: 120, backgroundColor: item.hidden ? '#f3f3f1' : '#6334E6' }]}>
                <Text style={[styles.item, { color: item.hidden ? '#666' : '#fff' }]}>{item.name}</Text>
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
        let empList = [];
        this.state.empList.forEach(function (el) {
            if (el.areaCode === item.areaCode) {
                el.hidden = !el.hidden;
            }
            empList.push(el);
        });
        this.setState({
            deptList: deptList,
            empList: empList
        });
    }

    empClick(item) {
        let empList = clickHandler(item, this.state.empList, 'name');
        this.setState({
            empList: empList
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
                        <View style={[styles.modalContainer, { height: 450 }]}>
                            <View style={{ height: 10, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>请选择门店</Text></View>
                            <View style={{ height: 140 }} >
                                <FlatList data={this.state.deptList} renderItem={this._renderDeptItem} horizontal={false} numColumns={2} />
                            </View>
                            <View style={{ height: 10, margin: 10, marginTop: 20 }}><Text style={{ fontSize: 14, color: '#333' }}>请选择门店下的店员</Text></View>
                            <FlatList style={{ flex: 1 }} data={this.state.empList} renderItem={this._renderEmpItem} horizontal={false} numColumns={2} />
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
                            <View style={{ height: 20, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>牌价详情</Text></View>
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
                                this.queryEmployeeTopData();
                            });
                        }
                    } />
                    <TouchableOpacity style={styles.button} onPress={() => { show(this, 'deptList', 'shopName', 'deptVisible'); }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../../assets/image/storage/filter.png')} />
                        <Text style={styles.text}>筛选</Text>
                    </TouchableOpacity>
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