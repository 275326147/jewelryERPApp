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
import data from './data';

export default class Center extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: this.getDate(),
            active: 1,
            detailVisible: false,
            deptVisible: false,
            data: data,
            row: {},
            deptList: [{
                key: 1,
                label: '周百福梅州店',
                hidden: false
            }, {
                key: 2,
                label: '梦金园',
                hidden: false
            }, {
                key: 3,
                label: '演示一店',
                hidden: false
            }],
            fields: [{
                key: 1,
                id: 'name',
                label: '名称',
                sortable: true
            }, {
                key: 2,
                id: 'calculateType',
                label: '方式',
                sortable: true
            }, {
                key: 3,
                id: 'saleNum',
                label: '件数',
                sortable: true
            }, {
                key: 4,
                id: 'labelPrice',
                label: '标价',
                editable: true,
                sortable: true
            }, {
                key: 5,
                id: 'saleGoldWeight',
                label: '金重',
                sortable: true
            }, {
                key: 6,
                id: 'settleTotalMoney',
                label: '实收',
                sortable: true
            }]
        };
    }

    oldFields = [{
        key: 1,
        id: 'goodsName',
        label: '商品名称',
        sortable: true
    }, {
        key: 2,
        id: 'calculateType',
        label: '类型',
        sortable: true
    }, {
        key: 3,
        id: 'netGoldWeight',
        label: '净金重',
        sortable: true
    }, {
        key: 4,
        id: 'worksFeeTotal',
        label: '工费',
        sortable: true
    }, {
        key: 5,
        id: 'totalMoney',
        label: '回收金额',
        sortable: true
    }]

    payFields = [{
        key: 1,
        id: 'settleType',
        label: '收款方式',
        width: Dimensions.get('screen').width / 2,
        sortable: true
    }, {
        key: 2,
        id: 'totalMoney',
        label: '金额',
        width: Dimensions.get('screen').width / 2,
        sortable: true
    }]

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
            {
                item.editable ?
                    <TextInput style={{ flex: 1, marginRight: 20, fontSize: 14, height: 30, padding: 0, paddingLeft: 10, width: 40, backgroundColor: '#f3f3f1' }}
                        onChangeText={(text) => this.setState({ [item.id]: text })}
                        value={this.state.row[item.id]}
                        underlineColorAndroid="transparent">
                    </TextInput>
                    :
                    <Text style={{ flex: 1, textAlign: 'left', fontSize: 14, color: '#333' }}>{this.state.row[item.id]}</Text>
            }
        </View>
    );

    _renderDeptItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this.deptClick(item); }}>
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

    clickHandler(item, dataList) {
        let list = [];
        dataList.forEach(function (el) {
            if (el.label === item.label) {
                el.hidden = !el.hidden;
            }
            if (el.label !== '全部' && item.label === '全部' && !item.hidden) {
                el.hidden = false;
            } else if (el.label !== '全部' && item.label === '全部' && item.hidden) {
                el.hidden = true;
            }
            list.push(el);
        });
        return list;
    }

    deptClick(item) {
        let deptList = this.clickHandler(item, this.state.deptList);
        this.setState({
            deptList: deptList
        });
    }


    showDept() {
        if (this.state.deptList[0].label !== '全部') {
            this.setState({
                deptList: [{
                    key: 0,
                    label: '全部',
                    hidden: false
                }].concat(this.state.deptList),
                deptVisible: true
            });
            return;
        }
        this.setState({
            deptVisible: true
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

    getDate(rowID) {
        let date = new Date();
        let fromDate = '';
        switch (rowID) {
            case '1':
                date = new Date(date.getTime() - 24 * 60 * 60 * 1000);
                date = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
                break;
            case '2':
                fromDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
                date = `${fromDate.getFullYear()}.${fromDate.getMonth() + 1}.${fromDate.getDate()}-${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
                break;
            case '3':
                fromDate = new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);
                date = `${fromDate.getFullYear()}.${fromDate.getMonth() + 1}.${fromDate.getDate()}-${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
                break;
            case '4':
                break;
            default:
                date = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
                break;
        }
        return date;
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
                        <View style={[styles.modalContainer, { height: 340, width: (Dimensions.get('window').width - 40) }]}>
                            <View style={{ height: 20, margin: 10 }}><Text style={{ fontSize: 14, color: '#333' }}>牌价详情</Text></View>
                            <FlatList style={{ flex: 1 }} data={this.state.fields} renderItem={this._renderDetailItem} />
                            <View style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 5 }}>
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#6334E6', borderRadius: 18, height: 30, width: 120 }]} onPress={() => { this._onDetailClose() }}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 14 }}>保存</Text>
                                </TouchableOpacity>
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
                            this.setState({ date: this.getDate(rowID) });
                        }
                    } />
                    <TouchableOpacity style={styles.button} onPress={() => { this.showDept() }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../../assets/image/storage/filter.png')} />
                        <Text style={styles.text}>门店</Text>
                    </TouchableOpacity>
                    {
                        this.state.active === 1 ?
                            <ModalDropdown options={['实际分类', '商品名称', '门店', '柜台']} />
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
                            onSort={this.onSort.bind(this)}
                            rowClick={this.rowClick.bind(this)}
                            filter={this.filter.bind(this)}
                            dataSource={this.state.data}
                            fields={this.state.fields} />
                        : <View />
                }
                {
                    this.state.active === 2 ?
                        <Datatable
                            onSort={this.onSort.bind(this)}
                            rowClick={this.rowClick.bind(this)}
                            filter={this.filter.bind(this)}
                            dataSource={this.state.data}
                            fields={this.oldFields} />
                        : <View />
                }
                {
                    this.state.active === 3 ?
                        <Datatable
                            onSort={this.onSort.bind(this)}
                            rowClick={this.rowClick.bind(this)}
                            filter={this.filter.bind(this)}
                            dataSource={this.state.data}
                            fields={this.payFields} />
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