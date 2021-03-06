/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React from 'react';
import PageComponent from '../PageComponent';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    FlatList
} from 'react-native';

export default class QueryCheck extends PageComponent {
    constructor(props) {
        super(props);
        this.backRoute = 'Check';
        this.state = {
            checkData: []
        }
    }

    componentDidMount() {
        super.componentDidMount('查询盘点单');
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{ height: 140, backgroundColor: '#fff', marginTop: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1, marginLeft: 10, fontSize: 14, color: '#333' }}>单号  <Text style={{ fontSize: 14, color: '#666' }}>{item.checkNo}</Text></Text>
                    <Text style={{ flex: 1, textAlign: 'right', marginRight: 10, fontSize: 14, color: '#666' }}>{item.lastUpdateDate}</Text>
                </View>
                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f3f1', marginLeft: 20, marginRight: 20 }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={{ textAlign: 'center', fontSize: 13, color: '#333' }}>总金重</Text>
                        <Text style={{ textAlign: 'center', fontSize: 13, color: 'orange', marginTop: 3 }}>{item.totalWeight}</Text>
                    </View>
                    <View style={{ height: 40, width: 1, borderLeftWidth: 1, borderColor: '#CFCFCF' }}></View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={{ textAlign: 'center', fontSize: 13, color: '#333' }}>盘点数量</Text>
                        <Text style={{ textAlign: 'center', fontSize: 13, color: 'orange', marginTop: 3 }}>{item.totalCount}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, marginTop: 20 }}>
                    <Text style={{ color: '#333', marginLeft: 10, fontSize: 12 }}>操作员:  <Text style={{ color: '#999', fontSize: 12 }}>{item.operator}</Text></Text>
                </View>
            </View >
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {
                    this.state.checkData.length === 0 ?
                        <Image style={styles.img} source={require('../../../assets/image/info/no_result.png')} />
                        :
                        <FlatList style={{ flex: 1 }} data={this.state.checkData} renderItem={this._renderItem} />
                }

            </View>
        );
    }

}

const styles = StyleSheet.create({
    img: {
        marginTop: 80,
        marginLeft: (Dimensions.get('window').width / 2 - 100),
        height: 200,
        width: 200
    }
});