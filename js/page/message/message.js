/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';
import React from 'react';
import PageComponent from '../PageComponent';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    Dimensions,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Modal,
    ScrollView,
    Platform
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import { callService, handleResult } from '../../utils/service';
import { forward, alert } from '../../utils/common';

export default class Message extends PageComponent {
    constructor(props) {
        super(props);
        this.backRoute = 'Home';
        this.state = {
            messageData: [],
            item: {},
            detailVisible: false
        }
    }

    _deleteMsg(item) {
        alert(
            this,
            'info',
            '是否确定删除？',
            () => {
                let params = new FormData();
                params.append('id', item.id);
                callService(this, 'deleteMessage.do', params, function (response) {
                    this.queryMsg();
                });
            },
            () => { }
        );
    }

    _setViewFlag() {
        let item = this.state.item;
        if (item.hasViewFlag == 0) {
            let params = new FormData();
            params.append('id', item.id);
            callService(this, 'updateHasViewFlag.do', params, function (response) {
                this.queryMsg();
            });
        }
    }

    queryMsg() {
        callService(this, 'getMessageList.do', new FormData(), function (response) {
            if (response.data) {
                this.setState({
                    messageData: handleResult(response.data)
                });
            }
        });
    }

    componentDidMount() {
        super.componentDidMount('消息列表');
        this.queryMsg();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    colorMap = {
        1: '#7A4EF6',
        2: '#F74C5C',
        3: '#F8D757',
        4: '#F8D757',
        5: '#769AFD',
        6: '#769AFD',
        7: '#7AD8C5'
    }

    /**
     *   1：公告(系统公告、升级公告、...)
     *   2：预警（库存预警、....）
     *   3: 待审核提醒
     *   4：审核驳回提醒
     *   5：调拨提醒
     *   6：调拨驳回提醒
     *   7：日报
     */
    textMap = {
        1: '公',
        2: '警',
        3: '审',
        4: '审',
        5: '调',
        6: '调',
        7: '日'
    }

    _renderItem = ({ item }) => (
        <Swipeout autoClose={true} right={[{ text: '删除', backgroundColor: 'red', onPress: () => { this._deleteMsg(item) } }]}>
            <TouchableWithoutFeedback onPress={() => this.setState({ item: item, detailVisible: true }, function () { this._setViewFlag() })}>
                <View style={styles.itemContainer}>
                    <View style={{ height: 20, flexDirection: 'row', margin: 5, marginLeft: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: 20, width: 20, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginRight: 5, backgroundColor: this.colorMap[item.msgType] }}>
                            <Text style={{ backgroundColor: 'transparent', color: '#fff', textAlign: 'center', fontSize: 13 }}>{this.textMap[item.msgType]}</Text>
                        </View>
                        <Text style={{ flex: 1, fontSize: 14, color: item.hasViewFlag == 0 ? '#333' : '#999' }}>{item.msgTypeStr}</Text>
                        <Text style={{ fontSize: Platform.OS === 'ios' ? 14 : 12, width: 150, textAlign: 'right', color: item.hasViewFlag == 0 ? '#333' : '#999' }}>{item.createTime}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={[styles.contentText, { color: item.hasViewFlag == 0 ? '#666' : '#999' }]}>{item.msgDtl}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Swipeout>
    );

    _onClose() {
        this.setState({
            detailVisible: false
        });
    }

    _gotoDetail() {
        let type = this.state.item.msgType;
        switch (type) {
            case 3:
                forward(this, 'WaitApprove');
                break;
            case 4:
                forward(this, 'RejectApprove');
                break;
            case 5:
                forward(this, 'WaitReceive');
                break;
            case 6:
                forward(this, 'RejectTransfer');
                break;
            case 7:
                forward(this, 'DailyReport');
                break;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    visible={this.state.detailVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => { this._onClose() }}>
                    <View style={styles.modalContainer}>
                        <View style={styles.content}>
                            <View style={{ height: 50, width: 250, alignItems: 'center' }}>
                                <Text style={styles.detailTitle}>
                                    {this.state.item.msgTypeStr}
                                </Text>
                                <Text style={styles.detailTime}>
                                    {this.state.item.createTime}
                                </Text>
                            </View>
                            <View style={{ height: 1, width: 250, marginLeft: 20, marginRight: 20, borderBottomWidth: 1, borderColor: '#f3f3f1' }} />
                            <ScrollView style={styles.scroll}>
                                <Text style={styles.detailContent}>
                                    {this.state.item.msgDtl}
                                </Text>
                            </ScrollView>
                            <View style={{ height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                {
                                    (this.state.item.msgType == 1 || this.state.item.msgType == 2) ? <View /> :
                                        <TouchableOpacity style={styles.button} onPress={() => this._gotoDetail()}>
                                            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 14 }}>查看详情</Text>
                                        </TouchableOpacity>
                                }
                                <TouchableOpacity style={[styles.button, { backgroundColor: '#f3f3f1' }]} onPress={() => this._onClose()}>
                                    <Text style={{ textAlign: 'center', color: '#333', fontSize: 14 }}>关闭</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal >
                {
                    this.state.messageData.length === 0 ?
                        <View style={{ flex: 1 }}>
                            <Image style={styles.resultImg} source={require('../../../assets/image/info/no_result.png')} />
                        </View>
                        :
                        <FlatList style={{ marginTop: 10 }} data={this.state.messageData} renderItem={this._renderItem} />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    resultImg: {
        marginTop: 80,
        marginLeft: (Dimensions.get('window').width / 2 - 100),
        height: 200,
        width: 200
    },
    itemContainer: {
        height: 80,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#f3f3f1',
        backgroundColor: '#fff'
    },
    contentText: {
        fontSize: 13,
        color: '#999',
        marginLeft: 26
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        width: 250,
        height: 300,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    button: {
        height: 30,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderWidth: 0,
        width: 90,
        backgroundColor: '#6334E6'
    },
    detailTitle: {
        flex: 1,
        color: '#333',
        fontSize: Platform.OS === 'ios' ? 16 : 15,
        textAlign: 'center',
        marginTop: 10
    },
    detailTime: {
        flex: 1,
        color: '#999',
        fontSize: 12,
        textAlign: 'center'
    },
    detailContent: {
        flex: 1,
        color: '#666',
        fontSize: 14,
        margin: 10
    }
});