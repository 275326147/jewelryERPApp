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

export default class NewCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 0
        };
    }

    mainCheckData = [{
        key: 1,
        name: 'A主单',
        status: 1
    }, {
        key: 2,
        name: 'B主单',
        status: 2
    }, {
        key: 3,
        name: 'C主单',
        status: 3
    }, {
        key: 4,
        name: 'D主单',
        status: 3
    }, {
        key: 5,
        name: 'E主单',
        status: 3
    }];

    _selectCheck(key) {
        if (this.state.selected === key) {
            this.setState({
                selected: 0
            });
        } else {
            this.setState({
                selected: key
            });
        }
    }

    _renderItem = ({ item }) => {
        if (item.status === 3) {
            return (
                <TouchableWithoutFeedback onPress={() => { this._selectCheck(item.key) }}>
                    <View style={[styles.check, { backgroundColor: this.state.selected === item.key ? '#7A67EE' : '#fff', borderWidth: this.state.selected === item.key ? 0 : 1 }]}>
                        <View style={{ width: 40 }}></View>
                        <Text style={[styles.item, { color: this.state.selected === item.key ? '#fff' : '#333' }]}>{item.name}</Text>
                        <View style={{ width: 40 }}>
                            {this.state.selected === item.key ? <Text></Text> :
                                <Text style={[styles.text, { color: '#fff' }]}>选中</Text>
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
        return (
            <View style={[styles.check, { backgroundColor: '#f3f3f1' }]}>
                {
                    item.status === 1 ?
                        <Image style={{ width: 20, height: 20, margin: 10 }} source={require('../../../assets/image/check/newCheck.png')} />
                        :
                        <View style={{ width: 40 }}></View>
                }
                <Text style={[styles.item, { color: '#bdbdbd', marginLeft: 20 }]}>{item.name}</Text>
                <Text style={styles.text}>已盘</Text>
            </View>
        );
    };

    _gotoPage(url) {
        this.props.navigation.navigate(url);
    }

    render() {
        let count = 0;
        this.mainCheckData.forEach(function (item) {
            if (item.status === 3) {
                count++;
            }
        });
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
                    <Image style={{ width: 20, height: 20, margin: 10 }} source={require('../../../assets/image/check/newCheck.png')} />
                    <Text style={{ marginTop: 10 }}>当前有（ <Text style={{ color: '#4876FF' }}>{count}</Text> ）个主单待盘点</Text>
                </View>
                <FlatList style={{ flex: 1, backgroundColor: '#fff' }} data={this.mainCheckData} renderItem={this._renderItem} />
                <View style={{ backgroundColor: '#fff', height: 30 }}>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} onPress={() => { this._gotoPage('Checking') }}>
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