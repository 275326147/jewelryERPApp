'use strict';
import React from 'react';
import PageComponent from '../PageComponent';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    Keyboard,
    Platform
} from 'react-native';
import { callService, handleResult } from '../../utils/service';
import { alert } from '../../utils/common';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;
export default class WaitApprove extends PageComponent {

    constructor(props) {
        super(props);
        this.backRoute = 'Todo';
        this.state = {
            top: (screenHeight / 2 - 80),
            modalVisible: false,
            todoList: [],
            current: {}
        };
    }

    typeMap = {
        1: {
            color: '#ACC2FA',
            label: '进货单'
        },
        2: {
            color: '#93D987',
            label: '调拨单'
        },
        3: {
            color: '#7AD8C5',
            label: '调价单'
        }
    }

    queryTodoList() {
        let params = new FormData();
        params.append("todoType", 1);
        callService(this, 'getMyTodoList.do', params, function (response) {
            if (response.todo1List) {
                this.setState({
                    todoList: handleResult(response.todo1List)
                });
            }
        });
    }

    componentDidMount() {
        super.componentDidMount('待审批');
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            let keyboardHeight = event.endCoordinates.height;
            this.setState({
                top: (screenHeight - keyboardHeight - 160)
            });
        });
        //监听键盘隐藏事件
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({
                top: (screenHeight / 2 - 80)
            });
        });
        this.queryTodoList();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        //卸载键盘弹出事件监听
        if (this.keyboardDidShowListener != null) {
            this.keyboardDidShowListener.remove();
        }
        //卸载键盘隐藏事件监听
        if (this.keyboardDidHideListener != null) {
            this.keyboardDidHideListener.remove();
        }
    }

    _renderItem = ({ item }) => {
        let type = item.sheetType;
        let color = this.typeMap[type] ? this.typeMap[type]['color'] : '#EBC77D';
        let label = this.typeMap[type] ? this.typeMap[type]['label'] : '未知单';
        return (
            <View style={styles.itemContainer}>
                <View style={{ height: 20, marginLeft: 10, marginTop: 5 }}>
                    <View style={{ height: 16, width: 45, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 10, color: '#fff' }}>{label}</Text>
                    </View>
                </View>
                <View style={{ marginLeft: 20, flexDirection: 'row', marginTop: 5 }}>
                    <Text style={{ fontSize: 14, color: '#333' }}>单号：</Text>
                    <Text style={{ fontSize: 14, color: '#333' }}>{item.sheetNo}</Text>
                </View>
                <View style={styles.split}></View>
                <View style={{ height: item.sheetType === 2 ? 140 : 100, marginLeft: 20, marginTop: 5 }}>
                    <Text style={styles.label}>提交人  <Text style={styles.value}>{item.submitter}</Text></Text>
                    <Text style={styles.label}>提交时间  <Text style={styles.value}>{item.submitTime}</Text></Text>
                    <Text style={styles.label}>门店  <Text style={styles.value}>{item.deptAreaName}</Text></Text>
                    <Text style={styles.label}>柜台  <Text style={styles.value}>{item.storeName}</Text></Text>
                    {
                        item.sheetType === 2 ?
                            <View style={{ height: 40 }}>
                                <Text style={styles.label}>接收门店  <Text style={styles.value}>{item.deptAreaName2}</Text></Text>
                                <Text style={styles.label}>接收柜台  <Text style={styles.value}>{item.storeName2}</Text></Text>
                            </View>
                            :
                            <View />
                    }
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.detailContainer}>
                        <Text style={styles.label}>数量</Text>
                        <Text style={styles.value}>{item.num}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.label}>标价金额</Text>
                        <Text style={[styles.value, { color: 'orange' }]}>{item.salePrice}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.label}>金重</Text>
                        <Text style={styles.value}>{item.goldWeight}g</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.label}>石重</Text>
                        <Text style={styles.value}>{item.stoneWeight}</Text>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => { this.setState({ current: item, modalVisible: true }) }}>
                        <Text style={styles.buttonText}>驳回</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => { this.receive(item) }}>
                        <Text style={styles.buttonText}>接收</Text>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }

    _onClose() {
        this.setState({ modalVisible: false });
    }

    receive(item) {
        let params = new FormData();
        params.append("sheetId", item.id);
        params.append("sheetType", item.sheetType);
        params.append("auditFlag", 1);
        callService(this, 'sheetAudit.do', params, function (response) {
            alert(
                this,
                'info',
                '审批成功',
                () => { this.queryTodoList() }
            );
        });
    }

    reject() {
        this._onClose();
        let item = this.state.current;
        let params = new FormData();
        params.append("sheetId", item.id);
        params.append("sheetType", item.sheetType);
        params.append("auditFlag", 2);
        params.append("remarks", item.remarks);
        callService(this, 'sheetAudit.do', params, function (response) {
            alert(
                this,
                'info',
                '驳回成功',
                () => { this.queryTodoList() }
            );
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <Modal
                    visible={this.state.modalVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onClose()}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.modalContainer, { position: 'absolute', top: this.state.top }]}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 3, height: 20, marginTop: 10, marginLeft: 20, fontSize: 14, color: '#333' }}>驳回</Text>
                                <TouchableOpacity onPress={() => this._onClose()}>
                                    <Image style={{ height: 25, width: 25, marginRight: 10, marginTop: 5 }} source={require('../../../assets/image/head/close.png')} />
                                </TouchableOpacity>
                            </View>
                            <TextInput style={styles.input} multiline={true}
                                placeholder='&nbsp;&nbsp;请输入驳回意见'
                                onChangeText={(text) => this.state.current.remarks = text}
                                placeholderTextColor={'#999'}
                                underlineColorAndroid="transparent" />
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                <TouchableOpacity style={[styles.button, { borderWidth: 0, width: 150, backgroundColor: '#6334E6' }]} onPress={() => this.reject()}>
                                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13 }}>确定</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={styles.title}>
                    <Image style={styles.titleImg} source={require('../../../assets/image/todo/waitApprove.png')} />
                    <Text style={{ fontSize: 13, color: '#333' }}>待审核</Text>
                </View >
                <FlatList style={{ flex: 1 }} data={this.state.todoList} renderItem={this._renderItem} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        fontSize: 14,
        height: 70,
        width: Dimensions.get('window').width - 100,
        backgroundColor: '#F9F9F9',
        marginTop: 5,
        marginBottom: 10,
        marginRight: 20,
        marginLeft: 20,
        padding: 0
    },
    modalContainer: {
        backgroundColor: '#fff',
        height: 160,
        width: (Dimensions.get('window').width - 60),
        borderRadius: 4
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    detailContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        height: 30,
        width: 65,
        borderWidth: 1,
        borderColor: '#b5b5b5',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    buttonText: {
        textAlign: 'center',
        color: '#333'
    },
    bottomContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentContainer: {
        width: (Dimensions.get('window').width - 30),
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#E9E9E9',
        height: 50,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: Platform.OS === 'ios' ? 14 : 12,
        color: '#333',
        marginTop: 5
    },
    value: {
        fontSize: Platform.OS === 'ios' ? 14 : 12,
        color: '#666',
        marginTop: 5
    },
    split: {
        width: (Dimensions.get('window').width - 30),
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
        borderTopWidth: 2,
        borderColor: '#f3f3f1'
    },
    title: {
        height: 30,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleImg: {
        height: 20,
        width: 20,
        margin: 10,
        marginLeft: 20
    },
    itemContainer: {
        height: 320,
        backgroundColor: '#fff',
        marginBottom: 10
    }
});