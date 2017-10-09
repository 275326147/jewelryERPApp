/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import { callService } from '../../utils/service';

export default class NewCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainCheckData: []
        };
    }

    queryMainSheet() {
        callService(this, 'queryCanCheckMainSheetList.do', new FormData(), function (response) {
            this.setState({
                mainCheckData: response.mainSheetList
            });
        });
    }

    componentWillMount() {
        this.msgListener = DeviceEventEmitter.addListener('refreshCheck', (listenerMsg) => {
            this.queryMainSheet();
        });
        this.queryMainSheet();
    }


    componentWillUnmount() {
        this.msgListener && this.msgListener.remove();
    }

    _selectCheck(item) {
        this.setState({
            selected: item
        });
    }

    _renderItem = ({ item }) => {
        let selectedKey = this.state.selected.key;
        return (
            <TouchableWithoutFeedback onPress={() => { this._selectCheck(item) }}>
                <View style={[styles.check, { backgroundColor: selectedKey === item.key ? '#7A67EE' : '#fff', borderWidth: selectedKey === item.key ? 0 : 1 }]}>
                    <View style={{ width: 40 }}></View>
                    <Text style={[styles.item, { color: selectedKey === item.key ? '#fff' : '#333' }]}>{item.sheetNo}</Text>
                    <View style={{ width: 40, marginRight: 20 }}>
                        {selectedKey === item.key ? <Text style={[styles.text, { color: '#fff' }]}>选中</Text> : <Text></Text>}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    createSubSheet() {        
        let params = new FormData();
        params.append("mainSheetId", this.state.selected.id);
        callService(this, 'createSubSheetByMain.do', params, function (response) {
            this.props.navigation.navigate('Checking', { item: this.state.selected });
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
                    <Image style={{ width: 20, height: 20, margin: 10 }} source={require('../../../assets/image/check/newCheck.png')} />
                    <Text style={{ marginTop: 10 }}>当前有（ <Text style={{ color: '#4876FF' }}>{this.state.mainCheckData.length}</Text> ）个主单待盘点</Text>
                </View>
                <FlatList style={{ flex: 1, backgroundColor: '#fff' }} data={this.state.mainCheckData} renderItem={this._renderItem} />
                <View style={{ backgroundColor: '#fff', height: 30 }}>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} onPress={() => { this.createSubSheet() }}>
                        <Text style={{ color: '#7A67EE', marginBottom: 8, fontSize: 13 }}>下一步</Text>
                        <Image style={{ width: 15, height: 15, marginLeft: 5, marginBottom: 10, marginRight: 20 }} source={require('../../../assets/image/foot/next.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    item: {
        flex: 1,
        fontSize: 12,
        textAlign: 'center'
    },
    check: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: (Dimensions.get('window').width - 40),
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10
    },
    text: {
        width: 40,
        color: '#32CD32',
        marginRight: 20,
        fontSize: 12,
        textAlign: 'center'
    }
});