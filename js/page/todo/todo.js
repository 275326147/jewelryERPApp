/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React from 'react';
import PageComponent from '../PageComponent';
import {
    Platform,
    View,
    Text,
    FlatList,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';
import { callService } from '../../utils/service';
import { forward, alert } from '../../utils/common';

export default class Center extends PageComponent {

    constructor(props) {
        super(props);
        this.backRoute = 'Home';
        this.state = {
            todoData: [{ key: 1, text: '待审核', url: 'WaitApprove', num: 0, split: true },
            { key: 2, text: '审核驳回', url: 'RejectApprove', num: 0 },
            { key: 3, text: '待接收在途', url: 'WaitReceive', num: 0, split: true },
            { key: 4, text: '调拨驳回', url: 'RejectTransfer', num: 0 }]
        }
    }

    queryMyTodo() {
        callService(this, 'getMyTodoNum.do', new FormData(), function (response) {
            if (response.myTodoNum) {
                this.setState({
                    todoData: [{ key: 1, text: '待审核', url: 'WaitApprove', num: response.myTodoNum.needAuditSheetNum, split: true },
                    { key: 2, text: '审核驳回', url: 'RejectApprove', num: response.myTodoNum.auditRejectSheetNum },
                    { key: 3, text: '待接收在途', url: 'WaitReceive', num: response.myTodoNum.onWayNeedReceiveSheetNum, split: true },
                    { key: 4, text: '调拨驳回', url: 'RejectTransfer', num: response.myTodoNum.rejectMoveSheetNum }]
                });
            }
        });
    }


    componentDidMount() {
        super.componentDidMount('待办事项');
        this.queryMyTodo();
        this.msgListener = DeviceEventEmitter.addListener('refreshMyTodo', (listenerMsg) => {
            this.queryMyTodo();
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.msgListener && this.msgListener.remove();
    }

    handleTodo(item) {
        if (item.num <= 0) {
            alert(this, 'info', '暂无待办事项');
            return;
        }
        forward(this, item.url);
    }

    _renderTodo = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this.handleTodo(item) }}>
            <View style={item.split ? styles.splitContainer : styles.todoContainer}>
                <Text style={styles.todoText}>{item.text}</Text>
                <Text style={styles.countText}>{item.num}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    render() {
        return (
            <View style={styles.container}>
                <View style={{ height: 130 }}>
                    <FlatList style={styles.todoList} data={this.state.todoData} renderItem={this._renderTodo} horizontal={false} numColumns={2} />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 30
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
    todoList: {
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