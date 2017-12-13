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

const menuData = [{ key: 1, text: '会员查询', permission: '101001', url: 'Member', img: require('../../../assets/image/home/mark.png') },
{ key: 2, text: '盘点', permission: '103001', url: 'Check', img: require('../../../assets/image/home/check.png') },
{ key: 3, text: '商品跟踪', permission: '102001', url: 'Track', img: require('../../../assets/image/home/follow.png') },
{ key: 4, text: '今日牌价', permission: '100001', url: 'Price', img: require('../../../assets/image/home/price.png') },
//{ key: 5, text: '销售开单',  permission: '',url: 'Sell', img: require('../../../assets/image/home/sell.png') },
{ key: 6, text: '库存汇总', permission: '104001', url: 'Storage', img: require('../../../assets/image/home/storage.png') },
{ key: 7, text: '日报表', permission: '104004', url: 'DailyReport', img: require('../../../assets/image/home/dailyRpt.png') },
{ key: 8, text: '商品销售排行', permission: '104002', url: 'GoodsReport', img: require('../../../assets/image/home/goodsRpt.png') },
{ key: 9, text: '店员销售排行', permission: '104003', url: 'EmployeeReport', img: require('../../../assets/image/home/empRpt.png') }
/*{ key: 10, text: 'CDJ商城', permission: '104003', url: 'CDJ', img: require('../../../assets/image/home/sell.png') },
{ key: 11, text: '3D定制', permission: '102001', url: 'Three', img: require('../../../assets/image/home/follow.png') }*/];

const screenWidth = Dimensions.get('window').width;
export default class Center extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menuData: []
        }
    }

    componentDidMount() {
        let data = [];
        menuData.forEach(function (item) {
            if (window.currentUser && window.currentUser.mobileRightStr.indexOf(item.permission) > -1) {
                data.push(item);
            }
        });
        this.setState({
            menuData: data
        });
    }

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
                <FlatList style={styles.list} data={this.state.menuData} renderItem={this._renderItem} horizontal={false} numColumns={3} />
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    img: {
        resizeMode: Image.resizeMode.stretch,
        width: screenWidth,
        height: 60
    },
    list: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    menuContainer: {
        width: screenWidth / 3,
        height: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    menuImg: {
        height: 50,
        width: 50,
        marginTop: 11
    },
    menuText: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 15
    }
});