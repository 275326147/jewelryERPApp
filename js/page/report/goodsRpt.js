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
import Spinner from '../../components/loading/loading';
import DatePicker from 'react-native-datepicker';
import Datatable from '../../components/datatable/datatable';
import ModalDropdown from '../../components/dropdown/ModalDropdown';
import { clickHandler, getShopList, show, getDate, setDate, sort } from './common';
import { callService, handleResult } from '../../utils/service';
import { unlockScreen } from '../../utils/common';

export default class Center extends PageComponent {

    constructor(props) {
        super(props);
        this.backRoute = 'Home';
        this.state = {
            loading: false,
            date: getDate(new Date()),
            active: 1,
            detailVisible: false,
            deptVisible: false,
            dateVisible: false,
            data: [],
            row: {},
            typeList: [{
                key: 1,
                label: '素金',
                hidden: false
            }, {
                key: 2,
                label: '非素',
                hidden: false
            }],
            deptList: [],
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
                id: 'saleStoneWeight',
                label: '石重'
            }, {
                key: 7,
                id: 'labelPrice',
                label: '标价'
            }, {
                key: 8,
                id: 'settleTotalMoney',
                label: '实收'
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
        this.setState({
            loading: true
        }, function () {
            callService(this, 'getSaleTopData.do', params, function (response) {
                let saleTopData = response.saleTopData;
                if (saleTopData) {
                    let data = [];
                    sort(saleTopData, 'settleTotalMoney');
                    saleTopData.forEach(function (item) {
                        let deptAreaName = item[0].deptAreaName;
                        data.push({ rowId: deptAreaName, disableClick: true });
                        let rowId = 1;
                        item.forEach(function (el) {
                            if (el.showName === '总计') {
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
                unlockScreen(this);
            }, function () {
                unlockScreen(this);
            });
        });
    }

    componentDidMount() {
        super.componentDidMount('商品销售排行');
        getShopList(this);
        this.querySaleTopData();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    _renderDetailItem = ({ item }) => (
        <View style={{ width: 280, height: 35, flexDirection: 'row' }}>
            <Text style={{ flex: 1, textAlign: 'left', fontSize: 14, color: '#999', marginLeft: 40 }}>{item.label}</Text>
            <Text style={{ flex: 2, textAlign: 'left', fontSize: 14, color: '#333' }}>{this.state.row[item.id]}</Text>
        </View>
    );

    _renderDeptItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this.deptClick(item); }}>
            <View style={[styles.itemContainer, { width: 120, backgroundColor: item.hidden ? '#f3f3f1' : '#6334E6' }]}>
                <Text style={[styles.item, { color: item.hidden ? '#666' : '#fff' }]}>{item.shopName}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    _renderTypeItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this.typeClick(item); }}>
            <View style={[styles.itemContainer, { width: 120, backgroundColor: item.hidden ? '#f3f3f1' : '#6334E6' }]}>
                <Text style={[styles.item, { color: item.hidden ? '#666' : '#fff' }]}>{item.label}</Text>
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
        this.querySaleTopData();
        this._onDateClose();
    }

    deptClick(item) {
        let deptList = clickHandler(item, this.state.deptList, 'shopName');
        this.setState({
            deptList: deptList
        }, function () {
            this.querySaleTopData();
        });
    }

    typeClick(item) {
        let typeList = clickHandler(item, this.state.typeList, 'label');
        this.setState({
            typeList: typeList
        }, function () {
            this.querySaleTopData();
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
                <Spinner visible={this.state.loading} textContent={""} textStyle={{ color: '#FFF' }} />
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
                            <View style={{ height: 10, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>请选择统计类型</Text></View>
                            <View style={{ height: 50 }}>
                                <FlatList data={this.state.typeList} renderItem={this._renderTypeItem} horizontal={false} numColumns={2} />
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
                        <View style={[styles.modalContainer, { height: 370 }]}>
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
        width: 300,
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