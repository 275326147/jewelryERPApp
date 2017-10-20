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
    Text
} from 'react-native';
import DataTable from '../../components/dataTable';
import data from './data';

export default class Center extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: [{
                id: 'deptAreaName',
                label: '门店',
                sortable: true,
                hidden: true
            }, {
                id: 'store',
                label: '柜台',
                sortable: true
            }, {
                id: 'goodsName',
                label: '商品名称',
                width: 100,
                sortable: true
            }, {
                id: 'supplierName',
                label: '供应商',
                sortable: true
            }, {
                id: 'goodsClassify',
                label: '实际分类',
                sortable: true,
            }, {
                id: 'statisticsClassify',
                label: '统计分类',
                sortable: true,
            }, {
                id: 'model',
                label: '核算模式',
                sortable: true,
            }, {
                id: 'classify',
                label: '品类',
                sortable: true,
            }, {
                id: 'num',
                label: '数量',
                sortable: true
            }, {
                id: 'goldWeight',
                label: '金重',
                sortable: true
            }, {
                id: 'price',
                label: '标价',
                sortable: true
            }]
        };
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.button} onPress={() => { }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../../assets/image/storage/filter.png')} />
                        <Text style={styles.text}>门店</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../../assets/image/storage/filter.png')} />
                        <Text style={styles.text}>柜台</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { }}>
                        <Image style={{ height: 20, width: 20 }} source={require('../../../assets/image/storage/filter.png')} />
                        <Text style={styles.text}>分组设置</Text>
                    </TouchableOpacity>
                </View>
                <DataTable
                    dataSource={data}
                    fields={this.state.fields} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
    },
    text: {
        color: '#333',
        fontSize: 14,
        textAlign: 'center'
    }
});