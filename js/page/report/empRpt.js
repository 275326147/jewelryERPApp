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
    TextInput,
    DeviceEventEmitter
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import Datatable from '../../components/datatable/datatable';
import ModalDropdown from '../../components/dropdown/ModalDropdown';
import { clickHandler, getShopList, show, getDate, setDate, sort } from './common';
import { callService, handleResult } from '../../utils/service';

export default class EmpReport extends PageComponent {

    constructor(props) {
        super(props);
        this.backRoute = 'Home';
        this.state = {
            date: getDate(new Date()),
            active: 1,
            detailVisible: false,
            deptVisible: false,
            dateVisible: false,
            data: [],
            row: {},
            deptList: [],
            empList: [],
            originEmpList: [],
            fields: [{
                key: 1,
                id: 'rowId',
                label: '排名'
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
                label: '实收'
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
                        if (el.employeeName === '总计') {
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

    filterEmp(data, deptList) {
        let empList = [];
        data.forEach(function (emp) {
            deptList.forEach(function (dept) {
                if (!dept.hidden && emp.areaCode && emp.areaCode.indexOf(dept.areaCode) > -1) {
                    empList.push(emp);
                }
            });
        });
        return handleResult([{
            name: '全部',
            hidden: false
        }].concat(empList));
    }

    componentDidMount() {
        super.componentDidMount('店员销售排行');
        getShopList(this, function () {
            let areaCode = [];
            let param = new FormData();
            this.state.deptList.forEach(function (item) {
                areaCode.push(item.areaCode);
            });
            param.append('areaCode', areaCode.join(','));
            callService(this, 'getEmployeeList.do', param, function (response) {
                let employeeList = response.employeeList;
                if (employeeList && employeeList.length > 0) {
                    this.setState({
                        empList: handleResult([{
                            name: '全部',
                            hidden: false
                        }].concat(employeeList)),
                        originStoreList: employeeList
                    }, function () {
                        this.queryEmployeeTopData();
                    });
                }
            });
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    _renderDetailItem = ({ item }) => (
        <View style={{ width: 280, height: 35, flexDirection: 'row' }}>
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
        this.queryEmployeeTopData();
        this._onDateClose();
    }

    deptClick(item) {
        let deptList = clickHandler(item, this.state.deptList, 'shopName');
        this.setState({
            deptList: deptList,
            empList: this.filterEmp(this.state.originStoreList, deptList)
        }, function () {
            this.queryEmployeeTopData();
        });
    }

    empClick(item) {
        let empList = clickHandler(item, this.state.empList, 'name');
        this.setState({
            empList: empList
        }, function () {
            this.queryEmployeeTopData();
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
                        <View style={styles.modalContainer}>
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
        width: 280,
        height: 340,
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
    textContainer: {
        width: 250,
        height: 20,
        backgroundColor: '#fff',
        marginTop: 5
    },
    text: {
        color: '#333',
        fontSize: 14,
        textAlign: 'center'
    }
});