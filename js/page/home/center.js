/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    Platform,
    View,
    ScrollView,
    Image,
    Text,
    FlatList,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import { callService } from '../../utils/service';
import { forward } from '../../utils/common';

export default class Center extends Component {

    constructor(props) {
        super(props);
    }

    menuData = [{ key: 1, text: '会员查询', url: 'Member', img: require('../../../assets/image/home/mark.png') },
    { key: 2, text: '盘点', url: 'Check', img: require('../../../assets/image/home/check.png') },
    { key: 3, text: '商品跟踪', url: 'Track', img: require('../../../assets/image/home/follow.png') },
    { key: 3, text: '今日牌价', url: '', img: require('../../../assets/image/home/price.png') },
    { key: 3, text: '销售开单', url: '', img: require('../../../assets/image/home/sell.png') },
    { key: 3, text: '商品库存', url: '', img: require('../../../assets/image/home/storage.png') }];

    _renderItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { forward(this, item.url) }}>
            <View style={styles.menuContainer}>
                <Image style={styles.menuImg} source={item.img} />
                <Text style={styles.menuText}>{item.text}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <Image style={styles.img} source={require('../../../assets/image/home/banner.jpg')} />
                <FlatList style={styles.list} data={this.menuData} renderItem={this._renderItem} horizontal={false} numColumns={3} />
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    img: {
        resizeMode: Image.resizeMode.stretch,
        width: Dimensions.get('window').width,
        height: 60
    },
    list: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    menuContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    menuImg: {
        height: 45,
        width: 45,
        marginTop: 11
    },
    menuText: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 10,
        marginBottom: 15
    }
});