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
import Start from '../page/start/start';
import Guide from '../page/start/guide';
import Login from '../page/login/login';
import CheckPwd from '../page/login/checkPwd';
import SetPwd from '../page/login/setPwd';
import ResetPwd from '../page/login/resetPwd';
import Home from '../page/home/home';
import Member from '../page/member/member';
import Message from '../page/message/message';
import UserInfo from '../page/user/userInfo';
import Track from '../page/track/track';
import Check from '../page/check/check';
import NewCheck from '../page/check/newCheck';
import QueryCheck from '../page/check/queryCheck';
import Checking from '../page/check/checking';
import Scanner from '../camera/scanner';
import RejectApprove from '../page/todo/rejectApprove';
import RejectTransfer from '../page/todo/rejectTransfer';
import WaitApprove from '../page/todo/waitApprove';
import WaitReceive from '../page/todo/waitReceive';

const styles = StyleSheet.create({
    img: {
        height: 20,
        width: 20,
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
                    <TouchableOpacity onPress={() => { navigation.navigate('Scanner'); }}>
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
        Track: {
            screen: Track,
            navigationOptions: ({ navigation }) => ({
                title: '商品跟踪'
            })
        },
        Check: {
            screen: Check,
            navigationOptions: ({ navigation }) => ({
                title: '盘点',
                headerRight: (
                    <TouchableOpacity style={styles.button} onPress={() => { DeviceEventEmitter.emit('refreshSubCheck', '刷新盘点主单'); }}>
                        <Text style={styles.buttonText}>刷新</Text>
                    </TouchableOpacity>
                )
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
                headerLeft: (
                    <TouchableOpacity onPress={() => { navigation.goBack(null); }}>
                        <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
                    </TouchableOpacity>
                )
            })
        },
        Checking: {
            screen: Checking,
            navigationOptions: ({ navigation }) => ({
                title: '盘点中',
                headerRight: (
                    <TouchableOpacity style={styles.button} onPress={() => { DeviceEventEmitter.emit('commitCheck', '提交盘点'); }}>
                        <Text style={styles.buttonText}>提交</Text>
                    </TouchableOpacity>
                ),
                headerLeft: (
                    <TouchableOpacity onPress={() => { DeviceEventEmitter.emit('refreshSubCheck', '刷新未提交盘点'); navigation.goBack('Check'); }}>
                        <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
                    </TouchableOpacity>
                )
            })
        },
        QueryCheck: {
            screen: QueryCheck,
            navigationOptions: ({ navigation }) => ({
                title: '盘点单查询',
                headerLeft: (
                    <TouchableOpacity onPress={() => { navigation.goBack(null); }}>
                        <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
                    </TouchableOpacity>
                )
            })
        },
        Message: {
            screen: Message,
            navigationOptions: ({ navigation }) => ({
                title: '通知消息',
                headerRight: (
                    <TouchableOpacity onPress={() => { navigation.navigate('Scanner'); }}>
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
        RejectApprove: {
            screen: RejectApprove,
            navigationOptions: ({ navigation }) => ({
                title: '待办事项'
            })
        },
        RejectTransfer: {
            screen: RejectTransfer,
            navigationOptions: ({ navigation }) => ({
                title: '待办事项'
            })
        },
        WaitApprove: {
            screen: WaitApprove,
            navigationOptions: ({ navigation }) => ({
                title: '待办事项'
            })
        },
        WaitReceive: {
            screen: WaitReceive,
            navigationOptions: ({ navigation }) => ({
                title: '待办事项'
            })
        },
        Scanner: {
            screen: Scanner,
            navigationOptions: ({ navigation }) => ({
                title: '扫描',
                headerLeft: (
                    <TouchableOpacity onPress={() => { navigation.goBack(null); }}>
                        <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
                    </TouchableOpacity>
                )
            })
        },
        Guide: {
            screen: Guide,
            navigationOptions: ({ navigation }) => ({
                header: null
            })
        },
        Start: {
            screen: Start,
            navigationOptions: ({ navigation }) => ({
                header: null
            })
        },
        Login: {
            screen: Login,
            navigationOptions: ({ navigation }) => ({
                header: null
            })
        },
        CheckPwd: {
            screen: CheckPwd,
            navigationOptions: ({ navigation }) => ({
                header: null
            })
        },
        SetPwd: {
            screen: SetPwd,
            navigationOptions: ({ navigation }) => ({
                header: null
            })
        },
        ResetPwd: {
            screen: ResetPwd,
            navigationOptions: ({ navigation }) => ({
                header: null
            })
        }
    },
    {
        initialRouteName: 'Start',
        navigationOptions: ({ navigation }) => ({
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: '#fff'
            },
            headerTitleStyle: {
                alignSelf: 'center'
            },
            headerLeft: (
                <TouchableOpacity onPress={() => { navigation.navigate('Home'); }}>
                    <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
                </TouchableOpacity>
            )
        })
    }
);

export default SimpleStack;