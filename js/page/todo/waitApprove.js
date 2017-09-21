import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput
} from 'react-native';
import data from './approveData';

export default class WaitApprove extends Component {

    constructor(props) {
        super(props);
        this.state = { modalVisible: false };
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

    _getData() {
        let filterData = [];
        data.forEach(function (item) {
            if (item.status === 1) {
                filterData.push(item);
            }
        });
        return filterData;
    }

    _renderItem = ({ item }) => {
        let color = this.typeMap[item.type] ? this.typeMap[item.type]['color'] : '#EBC77D';
        let label = this.typeMap[item.type] ? this.typeMap[item.type]['label'] : '未知单';
        return (
            <View style={styles.itemContainer}>
                <View style={{ height: 20, marginLeft: 10, marginTop: 5 }}>
                    <View style={{ height: 16, width: 45, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 10, color: '#fff' }}>{label}</Text>
                    </View>
                </View>
                <View style={{ marginLeft: 20, flexDirection: 'row', marginTop: 5 }}>
                    <Text style={{ fontSize: 14, color: '#333' }}>单号：</Text>
                    <Text style={{ fontSize: 14, color: '#333' }}>{item.no}</Text>
                </View>
                <View style={styles.split}></View>
                <View style={{ height: 40, marginLeft: 20, marginTop: 5 }}>
                    <Text style={styles.label}>提交人  <Text style={styles.value}>{item.creator}</Text></Text>
                    <Text style={styles.label}>提交时间  <Text style={styles.value}>{item.createDate}</Text></Text>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.detailContainer}>
                        <Text style={styles.label}>数量</Text>
                        <Text style={styles.value}>{item.count}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.label}>标价金额</Text>
                        <Text style={[styles.value, { color: 'orange' }]}>{item.price}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.label}>金重</Text>
                        <Text style={styles.value}>{item.goldWeight}g</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.label}>石重</Text>
                        <Text style={styles.value}>{item.stoneWeight}g</Text>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => { this.setState({ modalVisible: true }) }}>
                        <Text style={styles.buttonText}>驳回</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>接收</Text>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }

    _onClose() {
        this.setState({ modalVisible: false });
    }

    render() {
        let receiveData = this._getData();
        return (
            <View style={{ flex: 1 }} >
                <Modal
                    visible={this.state.modalVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onClose()}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 3, height: 20, marginTop: 20, marginLeft: 20, fontSize: 14, color: '#333' }}>驳回</Text>
                                <TouchableOpacity onPress={() => this._onClose()}>
                                    <Text style={{ flex: 1, textAlign: 'right', margin: 10, color: '#333', fontSize: 14 }}>X</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput style={styles.input} multiline={true}
                                placeholder='&nbsp;&nbsp;请输入驳回意见'
                                placeholderTextColor={'#999'}
                                underlineColorAndroid="transparent" />
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity style={[styles.button, { borderWidth: 0, width: 150, backgroundColor: '#6334E6' }]} onPress={() => this._onClose()}>
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
                <FlatList style={{ flex: 1 }} data={receiveData} renderItem={this._renderItem} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        fontSize: 14,
        height: 130,
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
        height: 240,
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
        fontSize: 12,
        color: '#333',
        marginTop: 5
    },
    value: {
        fontSize: 12,
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
        height: 220,
        backgroundColor: '#fff',
        marginBottom: 10
    }
});