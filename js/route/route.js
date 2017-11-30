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
import Todo from '../page/todo/todo';
import RejectApprove from '../page/todo/rejectApprove';
import RejectTransfer from '../page/todo/rejectTransfer';
import WaitApprove from '../page/todo/waitApprove';
import WaitReceive from '../page/todo/waitReceive';
import Price from '../page/price/price';
import Sell from '../page/sell/sell';
import Storage from '../page/storage/storage';
import DailyReport from '../page/report/dailyRpt';
import GoodsReport from '../page/report/goodsRpt';
import EmployeeReport from '../page/report/empRpt';

import { forward } from '../utils/common';


const styles = StyleSheet.create({
    imgContainer: {
        height: 25,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        height: 22,
        width: 22,
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
                    <TouchableOpacity style={styles.imgContainer} onPress={() => { forward(navigation, 'Scanner'); }}>
                        <Image style={styles.img} source={require('../../assets/image/head/camera.png')} />
                    </TouchableOpacity>
                ),
                headerLeft: (
                    <TouchableOpacity style={styles.imgContainer} onPress={() => { DeviceEventEmitter.emit('showSettings', '显示设置界面'); }}>
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
                    <TouchableOpacity style={styles.imgContainer} onPress={() => { forward(navigation, 'Check'); }}>
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
                    <TouchableOpacity onPress={() => { forward(navigation, 'Check'); }}>
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
                    <TouchableOpacity style={styles.imgContainer} onPress={() => { forward(navigation, 'Check'); }}>
                        <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
                    </TouchableOpacity>
                )
            })
        },
        Message: {
            screen: Message,
            navigationOptions: ({ navigation }) => ({
                title: '通知消息'
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
        },
        RejectApprove: {
            screen: RejectApprove,
            navigationOptions: ({ navigation }) => ({
                title: '待办事项',
                headerLeft: (
                    <TouchableOpacity style={styles.imgContainer} onPress={() => { forward(navigation, 'Todo'); }}>
                        <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
                    </TouchableOpacity>
                )
            })
        },
        RejectTransfer: {
            screen: RejectTransfer,
            navigationOptions: ({ navigation }) => ({
                title: '待办事项',
                headerLeft: (
                    <TouchableOpacity onPress={() => { forward(navigation, 'Todo'); }}>
                        <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
                    </TouchableOpacity>
                )
            })
        },
        WaitApprove: {
            screen: WaitApprove,
            navigationOptions: ({ navigation }) => ({
                title: '待办事项',
                headerLeft: (
                    <TouchableOpacity style={styles.imgContainer} onPress={() => { forward(navigation, 'Todo'); }}>
                        <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
                    </TouchableOpacity>
                )
            })
        },
        WaitReceive: {
            screen: WaitReceive,
            navigationOptions: ({ navigation }) => ({
                title: '待办事项',
                headerLeft: (
                    <TouchableOpacity style={styles.imgContainer} onPress={() => { forward(navigation, 'Todo'); }}>
                        <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
                    </TouchableOpacity>
                )
            })
        },
        Scanner: {
            screen: Scanner,
            navigationOptions: ({ navigation }) => ({
                title: '扫描',
                headerLeft: (
                    <TouchableOpacity style={styles.imgContainer} onPress={() => { forward(navigation, 'Track') }}>
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
        },
        Price: {
            screen: Price,
            navigationOptions: ({ navigation }) => ({
                title: '今日牌价'
            })
        },
        Sell: {
            screen: Sell,
            navigationOptions: ({ navigation }) => ({
                title: '销售开单'
            })
        },
        Storage: {
            screen: Storage,
            navigationOptions: ({ navigation }) => ({
                title: '库存汇总'
            })
        },
        DailyReport: {
            screen: DailyReport,
            navigationOptions: ({ navigation }) => ({
                title: '日报表'
            })
        },
        GoodsReport: {
            screen: GoodsReport,
            navigationOptions: ({ navigation }) => ({
                title: '商品销售排行'
            })
        },
        EmployeeReport: {
            screen: EmployeeReport,
            navigationOptions: ({ navigation }) => ({
                title: '店员销售排行'
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
                <TouchableOpacity style={styles.imgContainer} onPress={() => { forward(navigation, 'Home'); }}>
                    <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
                </TouchableOpacity>
            )
        })
    }
);

export default SimpleStack;