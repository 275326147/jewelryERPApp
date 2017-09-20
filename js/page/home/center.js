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
import Settings from '../user/settings';
import transferData from '../todo/transferData';
import approveData from '../todo/approveData';

let waitApprove = 0;
let rejectApprove = 0;
let waitReceive = 0;
let rejectTransfer = 0;

transferData.forEach(function (item) {
    if (item.status === 1) {
        waitReceive++;
    } else if (item.status === 2) {
        rejectTransfer++;
    }
});

approveData.forEach(function (item) {
    if (item.status === 1) {
        waitApprove++;
    } else if (item.status === 2) {
        rejectApprove++;
    }
});

export default class Center extends Component {

    constructor(props) {
        super(props);
    }

    menuData = [{ key: 1, text: '会员查询', url: 'Member', img: require('../../../assets/image/home/mark.png') },
    { key: 2, text: '盘点', url: 'Check', img: require('../../../assets/image/home/check.png') },
    { key: 3, text: '商品跟踪', url: 'Track', img: require('../../../assets/image/home/follow.png') }];

    todoData = [{ key: 1, text: '待审核', url: 'WaitApprove', count: waitApprove, split: true },
    { key: 2, text: '审核驳回', url: 'RejectApprove', count: rejectApprove },
    { key: 3, text: '待接收在途', url: 'WaitReceive', count: waitReceive, split: true },
    { key: 4, text: '调拨驳回', url: 'RejectTransfer', count: rejectTransfer }];

    _renderItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this._gotoPage(item.url) }}>
            <View style={styles.menuContainer}>
                <Image style={styles.menuImg} source={item.img} />
                <Text style={styles.menuText}>{item.text}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    _renderTodo = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this._gotoPage(item.url) }}>
            <View style={item.split ? styles.splitContainer : styles.todoContainer}>
                <Text style={styles.todoText}>{item.text}</Text>
                <Text style={styles.countText}>{item.count}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    _gotoPage = (url) => {
        this.props.navigation.navigate(url);
    };

    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <Settings navigation={this.props.navigation} />
                <Image style={styles.img} source={require('../../../assets/image/home/banner.jpg')} />
                <View style={styles.iconContainer}>
                    <FlatList style={styles.list} data={this.menuData} renderItem={this._renderItem} horizontal={false} numColumns={3} />
                </View>
                <View style={styles.container}>
                    <Text style={styles.txt}> 待办事项 </Text>
                    <View style={{ height: 130 }}>
                        <FlatList style={styles.todoList} data={this.todoData} renderItem={this._renderTodo} horizontal={false} numColumns={2} />
                    </View>
                </View>
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
    iconContainer: {
        height: 125,
        backgroundColor: '#f3f3f1',
        alignItems: 'stretch'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    txt: {
        height: 25,
        margin: 10,
        fontSize: 18,
        color: '#333333'
    },
    list: {
        margin: 10,
        borderRadius: 2,
        width: Dimensions.get('window').width - 20,
        backgroundColor: '#ffffff'
    },
    menuContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    todoContainer: {
        height: Platform.OS === 'android' ? 40 : 35,
        marginTop: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    splitContainer: {
        height: Platform.OS === 'android' ? 40 : 35,
        marginTop: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: '#d3d3d3'
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
    },
    todoList: {
        marginLeft: 20,
        borderRadius: 2,
        width: Dimensions.get('window').width - 40,
        backgroundColor: '#f3f3f1'
    },
    todoText: {
        textAlign: 'center',
        fontSize: 14
    },
    countText: {
        textAlign: 'center',
        color: 'orange',
        fontSize: 14,
        marginTop: Platform.OS === 'android' ? 0 : 5,
    }
});