'use strict';
import React from 'react';
import {
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import {
    StackNavigator,
} from 'react-navigation';

/**
 * 所有 component 整个框架内只有此处引入
 * navigator 统一进行路由显示
 * 将全部 component 的引用从老式的层级式改为统一入口的扁平式
 */
import Home from '../page/home/home';
import Member from '../page/member';
import Message from '../page/message';
import UserInfo from '../page/userInfo';
import Follow from '../page/follow';
import Check from '../page/check/check';
import Todo from '../page/todo/todo';
import NewCheck from '../page/check/newCheck';
import QueryCheck from '../page/check/queryCheck';

const styles = StyleSheet.create({
    img: {
        height: 20,
        width: 20,
        margin: 10
    }
});

const SimpleStack = StackNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: ({ navigation }) => ({
                header: null
            })
        },
        Member: {
            screen: Member,
            navigationOptions: ({ navigation }) => ({
                title: '会员查询'
            })
        },
        Follow: {
            screen: Follow,
            navigationOptions: ({ navigation }) => ({
                title: '商品跟踪'
            })
        },
        Check: {
            screen: Check,
            navigationOptions: ({ navigation }) => ({
                title: '盘点'
            })
        },
        NewCheck: {
            screen: NewCheck,
            navigationOptions: ({ navigation }) => ({
                title: '新建盘点'
            })
        },
        QueryCheck: {
            screen: QueryCheck,
            navigationOptions: ({ navigation }) => ({
                title: '盘点单查询'
            })
        },
        Message: {
            screen: Message,
            navigationOptions: ({ navigation }) => ({
                header: null
            })
        },
        UserInfo: {
            screen: UserInfo,
            navigationOptions: ({ navigation }) => ({
                title: '账户信息'
            })
        },
        Todo: {
            screen: Todo,
            navigationOptions: ({ navigation }) => ({
                title: '待办事项'
            })
        }
    },
    {
        initialRouteName: 'Home',
        mode: 'card',
        headerMode: 'float',
        navigationOptions: ({ navigation }) => ({
            headerLeft: (
                <TouchableOpacity onPress={() => { navigation.goBack(null); }}>
                    <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
                </TouchableOpacity>
            )
        })
    }
);

export default SimpleStack;