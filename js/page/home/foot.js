/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import { forward } from '../../utils/common';
import { callService } from '../../utils/service';

export default class Foot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            todoNum: 0,
            msgNum: 0
        }
    }

    queryCount() {
        callService(this, 'getMyTodoNum.do', new FormData(), function (response) {
            response = response.myTodoNum;
            if (response) {
                let totalNum = (response.needAuditSheetNum || 0) + (response.auditRejectSheetNum || 0) +
                    (response.onWayNeedReceiveSheetNum || 0) + (response.rejectMoveSheetNum || 0);
                this.setState({
                    todoNum: totalNum
                });
            }
        });

        callService(this, 'getNoViewNum.do', new FormData(), function (response) {
            response = response.data;
            if (response) {
                this.setState({
                    msgNum: response.pageCount
                });
            }
        });
    }

    componentDidMount() {
        this.queryCount();
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { forward(this, 'Todo') }}>
                    <View style={styles.imgContainer}>
                        <Image style={styles.img} source={require('../../../assets/image/foot/todo.png')} />
                        {
                            this.state.todoNum > 0 ?
                                <View style={styles.numContainer}>
                                    <Text style={styles.num}>{this.state.todoNum}</Text>
                                </View>
                                : <View />
                        }
                        <Text style={[styles.txt, { marginTop: this.state.todoNum > 0 ? 12 : 2 }]}>我的待办</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ flex: 1 }} onPress={() => { forward(this, 'Message') }}>
                    <View style={styles.imgContainer}>
                        <Image style={styles.img} source={require('../../../assets/image/foot/msg.png')} />
                        {
                            this.state.msgNum > 0 ?
                                <View style={styles.numContainer}>
                                    <Text style={styles.num}>{this.state.msgNum}</Text>
                                </View>
                                : <View />
                        }
                        <Text style={[styles.txt, { marginTop: this.state.msgNum > 0 ? 12 : 2 }]}>消息</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    numContainer: {
        backgroundColor: '#f7656f',
        borderRadius: 30,
        width: 20,
        height: 15,
        marginTop: -25,
        marginLeft: 28
    },
    num: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        color: '#fff',
        fontSize: 10
    },
    container: {
        borderTopWidth: 1,
        borderColor: '#f3f3f1',
        height: 55,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    imgContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        height: 25,
        width: 25,
        marginTop: 5
    },
    txt: {
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 5
    }
});