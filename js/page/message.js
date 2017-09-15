/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text
} from 'react-native';
import Foot from './home/foot';

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    messageData = [{ key: 1, title: '牌价变动', time: '2017-09-10 11:12:13', content: '今日牌价已更新，请知悉！' },
    { key: 2, title: '库存预警', time: '2017-09-12 10:09:13', content: '库存已到达预警上限，请知悉！' },
    { key: 3, title: '调价通知', time: '2017-09-13 09:12:13', content: '纸巾价格翻了十倍，请知悉！' },
    { key: 4, title: '调拨通知', time: '2017-09-14 13:12:13', content: '某某门店调拨了一条狗过来，请知悉！' }];

    _renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={{ height: 20, flexDirection: 'row', margin: 5, marginLeft: 10 }}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.contentText}>{item.content}</Text>
            </View>
        </View>
    );

    render() {
        return (
            <View style={styles.container}>
                <FlatList style={{ marginTop: 10 }} data={this.messageData} renderItem={this._renderItem} />
                <Foot navigation={this.props.navigation} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    itemContainer: {
        height: 80,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#f3f3f1',
        backgroundColor: '#fff'
    },
    titleText: {
        flex: 1,
        fontSize: 13
    },
    timeText: {
        flex: 1,
        textAlign: 'right',
        fontSize: 13,
        color: '#666'
    },
    contentText: {
        fontSize: 13,
        color: '#999'
    }
});