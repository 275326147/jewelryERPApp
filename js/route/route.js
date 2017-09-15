'use strict';
import React from 'react';
import {
    TouchableOpacity,
    Image,
    StyleSheet,
    DeviceEventEmitter,
    Text
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
        height: 18,
        width: 18,
        marginLeft: 15,
        marginRight: 15
    },
    button: {
        height: 22,
        width: 40,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 18,
        justifyContent: 'center'
    },
    buttonText: {
        textAlign: 'center',
        color: '#333',
        fontSize: 12
    }
});

const SimpleStack = StackNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: ({ navigation }) => ({
                title: '首页',
                headerRight: (
                    <TouchableOpacity onPress={() => { }}>
                        <Image style={styles.img} source={require('../../assets/image/head/camera.png')} />
                    </TouchableOpacity>
                ),
                headerLeft: (
                    <TouchableOpacity onPress={() => { DeviceEventEmitter.emit('showSettings', '显示设置界面'); }}>
                        <Image style={styles.img} source={require('../../assets/image/head/user.png')} />
                    </TouchableOpacity>
                )
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
                title: '新建盘点',
                headerRight: (
                    <TouchableOpacity style={styles.button} onPress={() => { DeviceEventEmitter.emit('refreshCheck', '刷新盘点主单'); }}>
                        <Text style={styles.buttonText}>刷新</Text>
                    </TouchableOpacity>
                ),
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
                title: '通知消息',
                headerRight: (
                    <TouchableOpacity onPress={() => { }}>
                        <Image style={styles.img} source={require('../../assets/image/head/camera.png')} />
                    </TouchableOpacity>
                ),
                headerLeft: (
                    <TouchableOpacity onPress={() => { DeviceEventEmitter.emit('showSettings', '显示设置界面'); }}>
                        <Image style={styles.img} source={require('../../assets/image/head/user.png')} />
                    </TouchableOpacity>
                )
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
        navigationOptions: ({ navigation }) => ({
            headerStyle: {
                backgroundColor: '#fff'
            },
            headerTitleStyle: {
                alignSelf: 'center'
            },
            headerLeft: (
                <TouchableOpacity onPress={() => { navigation.goBack(null); }}>
                    <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
                </TouchableOpacity>
            )
        })
    }
);

export default SimpleStack;