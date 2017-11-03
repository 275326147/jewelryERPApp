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
import { callService, handleResult } from '../../utils/service';
import { clickHandler, getShopList, show, getDate, setDate } from './common';
import data from './data';

export default class Center extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: getDate(new Date()),
            active: 1,
            detailVisible: false,
            deptVisible: false,
            data: data,
            row: {},
            deptList: [],
            fields: [{
                key: 1,
                id: 'name',
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

    oldFields = [{
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

    payFields = [{
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

    componentDidMount() {
        getShopList(this);
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
                            <FlatList style={{ flex: 1 }} data={this.state.active === 1 ? this.state.fields : this.oldFields} renderItem={this._renderDetailItem} />
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
                            setDate(this, rowID);
                        }
                    } />
                    <TouchableOpacity style={styles.button} onPress={() => { show(this, 'deptList', 'shopName', 'deptVisible'); }}>
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
                            rowClick={this.rowClick.bind(this)}
                            dataSource={this.state.data}
                            fields={this.state.fields} />
                        : <View />
                }
                {
                    this.state.active === 2 ?
                        <Datatable
                            rowClick={this.rowClick.bind(this)}
                            dataSource={this.state.data}
                            fields={this.oldFields} />
                        : <View />
                }
                {
                    this.state.active === 3 ?
                        <Datatable
                            rowClick={this.rowClick.bind(this)}
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