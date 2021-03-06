/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React from 'react';
import PageComponent from '../PageComponent';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    Image,
    DeviceEventEmitter,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Modal,
    Keyboard,
    ScrollView
} from 'react-native';
import Spinner from '../../components/loading/loading';
import { callService, handleResult } from '../../utils/service';
import { alert, forward } from '../../utils/common';
import Barcode from 'react-native-smart-barcode';

export default class Checking extends PageComponent {
    constructor(props) {
        super(props);
        this.backRoute = 'Check';
        this.state = {
            loading: false,
            lock: false,
            type: 1,
            keyword: '',
            item: {},
            showCheckInfo: {},
            showCamera: true,
            hasCheckGoldWeight4SubSheet: 0,
            hasCheckNum4SubSheet: 0,
            selectGoodsVisible: false,
            updateGoodsVisible: false,
            goodsList: [],
            goods: {
                goodsInfo: {},
                showCheckInfo: {}
            }
        };
    }

    componentDidMount() {
        super.componentDidMount('盘点中');
        this.msgListener = DeviceEventEmitter.addListener('commitCheck', (listenerMsg) => {
            let params = new FormData();
            params.append("subSheetId", this.state.item.id);
            callService(this, 'submitSubSheet.do', params, function (response) {
                alert(
                    this,
                    'info',
                    '提交成功',
                    () => {
                        forward(this, 'Check');
                    }
                );
            });
        });
        let params = new FormData();
        params.append("subSheetId", this.props.navigation.state.params.item.id);
        callService(this, 'goodsCheckSubSheet.do', params, function (response) {
            this.setState({
                item: response.subSheetInfo,
                hasCheckGoldWeight4SubSheet: response.subSheetInfo.checkGoldWeight,
                hasCheckNum4SubSheet: response.subSheetInfo.checkNum
            });
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.msgListener && this.msgListener.remove();
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{ height: 100, flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#f3f3f1' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 55, height: 55, margin: 15 }} source={item.imgUrl} />
                </View>
                <View style={{ flex: 2, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={{ fontSize: 12, color: '#333', marginTop: 15 }}>商品条码  <Text style={{ fontSize: 12, color: '#999' }}>{item.barCode}</Text></Text>
                        <Text style={{ fontSize: 12, color: '#333', marginTop: 3 }}>商品名称  <Text style={{ fontSize: 12, color: '#999' }}>{item.goodsName}</Text></Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
                        <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{ fontSize: 10, color: '#333' }}>金重</Text>
                            <Text style={{ fontSize: 10, color: 'orange', marginTop: 3 }}>{item.weight}g</Text>
                        </View>
                        <View style={{ flex: 1, borderLeftWidth: 1, borderColor: '#f3f3f1', height: 20, alignItems: 'center' }}></View>
                        <View style={{ flex: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 10, color: '#333' }}>数量</Text>
                            <Text style={{ fontSize: 10, color: 'orange', marginTop: 3, marginLeft: 5 }}>{item.count}</Text>
                        </View>
                    </View>
                </View>
            </View >
        );
    }

    _startScan = () => {
        if (this._barCode) this._barCode.startScan();
    }

    _stopScan = (e) => {
        let now = new Date().getTime();
        let code = e.nativeEvent.data.code;
        if (this.lastScanTime && this.lastScanCode === code && (now - this.lastScanTime < 5000)) {
            return false;
        }
        if (this._barCode) this._barCode.stopScan();
        this.lastScanCode = code;
        this.lastScanTime = now;
        return true;
    }

    _onBarCodeRead(e) {
        if (!this.state.lock && this._stopScan(e)) {
            try {
                this.setState({ keyword: e.nativeEvent.data.code, lock: true }, () => {
                    this.queryGoods();
                });
            } catch (e) {
                console.error(e);
                this._startScan();
                this.setState({
                    lock: false
                });
            }
        }
    }

    queryGoods(type, importItemId) {
        let params = new FormData();
        params.append("subSheetId", this.state.item.id);
        params.append("codeType", type ? type : this.state.type);
        params.append("codeStr", this.state.keyword);
        if (importItemId) params.append("importItemId", importItemId);
        callService(this, 'doProcess4InputCheck.do', params, function (response) {
            let eventType = response.eventType;
            let master = this;
            switch (eventType) {
                case -1:
                    alert(
                        this,
                        'info',
                        response.msg,
                        () => {
                            master._startScan();
                            master.setState({
                                lock: false
                            });
                        }
                    );
                    break;
                case 1:
                    //选择一条进货记录，之后调用doProcess4InputCheck.do， codeType传4， importItemId传选择的importItemId
                    this.setState({
                        goodsList: handleResult(response.importSheetItemList),
                        selectGoodsVisible: true
                    });
                    break;
                case 2:
                    //进货单一码多货
                    this.setState({
                        goods: response,
                        updateGoodsVisible: true
                    });
                    break;
                case 3:
                    //一码一货
                    master.setState({
                        goodsInfo: response.goodsInfo,
                        showCheckInfo: response.showCheckInfo,
                        hasCheckNum4SubSheet: response.hasCheckNum4SubSheet,
                        hasCheckGoldWeight4SubSheet: response.hasCheckGoldWeight4SubSheet,
                        lock: false
                    });
                    master._startScan();
                    break;
                case 4:
                    //修改已盘点一码多货
                    this.setState({
                        goods: response,
                        updateGoodsVisible: true
                    });
                    break;
                default:
                    master._startScan();
                    master.setState({
                        lock: false
                    });
                    break;
            }
        }, function () {
            master._startScan();
            master.setState({
                lock: false
            });
        });
        this.setState({ keyword: '' });
        Keyboard.dismiss();
    }

    _onSelectClose() {
        this.setState({
            selectGoodsVisible: false
        });
    }

    _onClose() {
        this.setState({
            updateGoodsVisible: false
        });
    }

    _selectGoods(item) {
        this.setState({
            selectGoodsVisible: false
        });
        this.queryGoods(4, item.importItemId);
    }

    submit() {
        let params = new FormData();
        params.append("mainSheetId", this.state.item.mainSheetId);
        params.append("subSheetId", this.state.item.id);
        params.append("itemId", this.state.goods.goodsInfo.itemId);
        params.append("dataType", this.state.goods.goodsInfo.itemType);
        if (this.state.checkNum) params.append("num", parseInt(this.state.checkNum));
        if (this.state.goldWeight) params.append("goldWeight", parseInt(this.state.goldWeight));
        if (this.state.stoneWeight) params.append("stoneWeight", parseInt(this.state.stoneWeight));
        callService(this, 'doProcess4InputCheckData.do', params, function (response) {
            this.setState({
                goodsInfo: response.checkItemInfo,
                showCheckInfo: response.showCheckInfo,
                hasCheckNum4SubSheet: response.hasCheckNum4SubSheet,
                hasCheckGoldWeight4SubSheet: response.hasCheckGoldWeight4SubSheet
            });
        });
        this._startScan();
        this.setState({
            lock: false,
            checkNum: null,
            goldWeight: null,
            stoneWeight: null
        });
        this._onClose();
    }

    _renderGoodsItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this._selectGoods(item) }}>
            <View style={styles.menuContainer}>
                <Text style={styles.menuText}>{item.goodsName}</Text>
                <View style={styles.menuLine}>
                    <Text style={styles.menuLabel}>条码</Text>
                    <Text style={styles.menuValue}>{item.barCode}</Text>
                    <Text style={styles.menuLabel}>原条码</Text>
                    <Text style={styles.menuValue}>{item.oldBarCode}</Text>
                </View>
                <View style={styles.menuLine}>
                    <Text style={styles.menuLabel}>证书号</Text>
                    <Text style={styles.menuValue}>{item.certificateNo}</Text>
                    <Text style={styles.menuLabel}>款号</Text>
                    <Text style={styles.menuValue}>{item.styleNo}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Spinner visible={this.state.loading} textContent={""} textStyle={{ color: '#FFF' }} />
                <Modal
                    visible={this.state.selectGoodsVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onSelectClose()}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.modalContainer, { height: (this.state.goodsList.length * 100) }]}>
                            <FlatList style={{ flex: 1 }} data={this.state.goodsList} renderItem={this._renderGoodsItem} />
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.updateGoodsVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onClose()}>
                    <View style={styles.modalBackground}>
                        <View style={styles.goodsContainer}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                {
                                    this.state.goods.goodsInfo.img ?
                                        <Image style={{ width: 55, height: 55, margin: 15 }} source={{ uri: this.state.goods.goodsInfo.img }} />
                                        :
                                        <Image style={{ width: 55, height: 55, margin: 15 }} source={require('../../../assets/image/check/empty.png')} />
                                }
                            </View>
                            <View style={{ flex: 2, flexDirection: 'column' }}>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: '#333', marginTop: 15 }}>商品条码  <Text style={{ fontSize: 12, color: '#999' }}>{this.state.goods.goodsInfo.barCode}</Text></Text>
                                    <Text style={{ fontSize: 12, color: '#333', marginTop: 3 }}>商品名称  <Text style={{ fontSize: 12, color: '#999' }}>{this.state.goods.goodsInfo.goodsName}</Text></Text>
                                </View>
                                <View style={{ flex: 2, flexDirection: 'row', marginTop: 30 }}>
                                    {
                                        this.state.goods.showCheckInfo.showGoldWeightInput ?
                                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 10, color: '#333' }}>金重</Text>
                                                <View>
                                                    <TextInput style={[styles.input, { height: 30, width: 50, borderRadius: 0 }]}
                                                        onChangeText={(text) => this.setState({ goldWeight: text })}
                                                        defaultValue={"" + this.state.goods.showCheckInfo.hasCheckGoldWeight}
                                                        keyboardType='numeric'
                                                        underlineColorAndroid="transparent">
                                                    </TextInput>
                                                </View>
                                            </View> : <View />
                                    }
                                    {
                                        this.state.goods.showCheckInfo.showNumInput ?
                                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 10, color: '#333' }}>数量</Text>
                                                <View>
                                                    <TextInput style={[styles.input, { height: 30, width: 50, borderRadius: 0 }]}
                                                        onChangeText={(text) => this.setState({ checkNum: text })}
                                                        defaultValue={"" + this.state.goods.showCheckInfo.hasCheckNum}
                                                        keyboardType='numeric'
                                                        underlineColorAndroid="transparent">
                                                    </TextInput>
                                                </View>
                                            </View> : <View />
                                    }
                                    {
                                        this.state.goods.showCheckInfo.showStoneWeightInput ?
                                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 10, color: '#333' }}>石重</Text>
                                                <View>
                                                    <TextInput style={[styles.input, { height: 30, width: 50, borderRadius: 0 }]}
                                                        onChangeText={(text) => this.setState({ stoneWeight: text })}
                                                        defaultValue={"" + this.state.goods.showCheckInfo.hasCheckStoneWeight}
                                                        keyboardType='numeric'
                                                        underlineColorAndroid="transparent">
                                                    </TextInput>
                                                </View>
                                            </View> : <View />
                                    }
                                </View>
                            </View>
                        </View >
                        <View style={[styles.goodsContainer, { height: 50 }]}>
                            <TouchableOpacity style={styles.button} onPress={() => this.submit()}>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13 }}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={{ height: 290 }}>
                    {
                        this.state.showCamera ?
                            <View style={{ flex: 1 }}>
                                <View style={styles.view_title_container}>
                                    <TouchableOpacity onPress={() => { this.setState({ type: 1 }) }}>
                                        <Text style={{ color: this.state.type === 1 ? '#7A67EE' : '#999', fontSize: 18, marginRight: 60 }}>原条码</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.setState({ type: 2 }) }}>
                                        <Text style={{ color: this.state.type === 2 ? '#7A67EE' : '#999', fontSize: 18, marginRight: 60 }}>条码</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.setState({ type: 3 }) }}>
                                        <Text style={{ color: this.state.type === 3 ? '#7A67EE' : '#999', fontSize: 18 }}>证书号</Text>
                                    </TouchableOpacity>
                                </View>
                                <Barcode style={{ flex: 1 }}
                                    scannerRectHeight={200}
                                    scannerRectTop={10}
                                    ref={component => this._barCode = component}
                                    onBarCodeRead={this._onBarCodeRead.bind(this)} />
                                <View style={{ alignItems: 'center', justifyContent: 'center', height: 30, backgroundColor: '#fff' }}>
                                    <TouchableOpacity onPress={() => { this.setState({ showCamera: false }) }}>
                                        <Image style={{ width: 30, height: 30 }} source={require('../../../assets/image/check/keyboard.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <View style={styles.container}>
                                <View style={styles.view_title_container}>
                                    <TouchableOpacity onPress={() => { this.setState({ type: 1 }) }}>
                                        <Text style={{ color: this.state.type === 1 ? '#7A67EE' : '#999', fontSize: 18, marginRight: 60 }}>原条码</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.setState({ type: 2 }) }}>
                                        <Text style={{ color: this.state.type === 2 ? '#7A67EE' : '#999', fontSize: 18, marginRight: 60 }}>条码</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.setState({ type: 3 }) }}>
                                        <Text style={{ color: this.state.type === 3 ? '#7A67EE' : '#999', fontSize: 18 }}>证书号</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.searchContainer}>
                                    <View>
                                        <TextInput style={styles.input} placeholder='请输入原条码号／条码号／证书号'
                                            onChangeText={(text) => this.setState({ keyword: text })}
                                            value={this.state.keyword}
                                            onSubmitEditing={(event) => {
                                                this.setState({ keyword: event.nativeEvent.text }, function () {
                                                    this.queryGoods();
                                                });
                                            }}
                                            underlineColorAndroid="transparent">
                                        </TextInput>
                                    </View>
                                    <TouchableWithoutFeedback onPress={() => { this.queryGoods() }}>
                                        <Image style={{ height: 25, width: 25 }} source={require('../../../assets/image/track/search.png')} />
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center', height: 35 }}>
                                    <TouchableOpacity onPress={() => { this.setState({ showCamera: true }) }}>
                                        <Image style={styles.cameraImg} source={require('../../../assets/image/head/camera.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                    }
                </View>
                <View style={{ height: 35, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ width: 70, fontSize: 12, color: '#333', textAlign: 'right' }}>盘点单号：</Text>
                    <Text style={{ flex: 2, fontSize: 12, color: '#999', textAlign: 'left' }}>{this.state.item.sheetNo}</Text>
                    <Text style={{ width: 50, fontSize: 10, color: '#333', textAlign: 'right' }}>操作员：</Text>
                    <Text style={{ flex: 1, fontSize: 10, color: '#999', textAlign: 'left' }}>{this.state.item.createUserName}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    {
                        this.state.goodsInfo ?
                            <View style={{ height: 100, flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#f3f3f1' }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    {
                                        this.state.goodsInfo.img ?
                                            <Image style={{ width: 55, height: 55, margin: 15 }} source={{ uri: this.state.goodsInfo.img }} />
                                            :
                                            <Image style={{ width: 55, height: 55, margin: 15 }} source={require('../../../assets/image/check/empty.png')} />
                                    }
                                </View>
                                <View style={{ flex: 2, flexDirection: 'column' }}>
                                    <View style={{ flex: 1, flexDirection: 'column' }}>
                                        <Text style={{ fontSize: 12, color: '#333', marginTop: 15 }}>商品条码  <Text style={{ fontSize: 12, color: '#999' }}>{this.state.goodsInfo.barCode}</Text></Text>
                                        <Text style={{ fontSize: 12, color: '#333', marginTop: 3 }}>商品名称  <Text style={{ fontSize: 12, color: '#999' }}>{this.state.goodsInfo.goodsName}</Text></Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 20, alignContent: 'space-between' }}>
                                        {
                                            this.state.showCheckInfo.showGoldWeightInput ?
                                                <View style={{ flex: 2, flexDirection: 'column', alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 10, color: '#333' }}>金重</Text>
                                                    <Text style={{ fontSize: 10, color: 'orange', marginTop: 3 }}>{this.state.showCheckInfo.hasCheckGoldWeight}g</Text>
                                                </View>
                                                : <View />
                                        }
                                        <View style={{ flex: 1, borderLeftWidth: 1, borderColor: '#f3f3f1', height: 20, alignItems: 'center' }}></View>
                                        {
                                            this.state.showCheckInfo.showNumInput ?
                                                <View style={{ flex: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <Text style={{ fontSize: 10, color: '#333' }}>数量</Text>
                                                    <Text style={{ fontSize: 10, color: 'orange', marginTop: 3, marginLeft: 5 }}>{this.state.showCheckInfo.hasCheckNum}</Text>
                                                </View>
                                                : <View />
                                        }
                                        <View style={{ flex: 1, borderLeftWidth: 1, borderColor: '#f3f3f1', height: 20, alignItems: 'center' }}></View>
                                        {
                                            this.state.showCheckInfo.showStoneWeightInput ?
                                                <View style={{ flex: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <Text style={{ fontSize: 10, color: '#333' }}>石重</Text>
                                                    <Text style={{ fontSize: 10, color: 'orange', marginTop: 3, marginLeft: 5 }}>{this.state.showCheckInfo.hasCheckStoneWeight}</Text>
                                                </View>
                                                : <View />
                                        }
                                    </View>
                                </View>
                            </View >
                            :
                            <View />
                    }
                </View>
                <View style={{ height: 35, backgroundColor: '#fff' }}>
                    <ScrollView style={{ flexDirection: 'row' }} horizontal={true} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ marginLeft: 20, fontSize: 12, color: '#333' }}>总金重：</Text>
                        <Text style={{ fontSize: 12, color: 'orange' }}>{this.state.hasCheckGoldWeight4SubSheet}克</Text>
                        <Text style={{ fontSize: 12, color: '#333', marginLeft: 40 }}>总数量：</Text>
                        <Text style={{ fontSize: 12, color: 'orange' }}>{this.state.hasCheckNum4SubSheet}件</Text>
                        <Text style={{ fontSize: 12, color: '#333', marginLeft: 40 }}>总石重：</Text>
                        <Text style={{ fontSize: 12, color: 'orange' }}>{this.state.showStoneWeightInput}</Text>
                    </ScrollView>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    goodsContainer: {
        width: Dimensions.get('window').width - 50,
        height: 140, flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        borderWidth: 0,
        width: 150,
        backgroundColor: '#6334E6',
        height: 30,
        borderColor: '#b5b5b5',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    menuContainer: {
        height: 100,
        width: 280,
        borderTopWidth: 1,
        borderBottomWidth: 0.5,
        borderColor: '#f3f3f1'
    },
    menuText: {
        margin: 15,
        marginRight: 10
    },
    menuLine: {
        height: 25,
        flexDirection: 'row',
        marginLeft: 10
    },
    menuLabel: {
        flex: 1,
        fontSize: 13,
        color: '#333'
    },
    menuValue: {
        flex: 2,
        fontSize: 13,
        color: '#666'
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        height: 200,
        backgroundColor: '#fff'
    },
    cameraImg: {
        height: 25,
        width: 25
    },
    view_title_container: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        height: 35,
        alignItems: 'center'
    },
    container: {
        height: 280,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    searchContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    input: {
        fontSize: 14,
        height: 50,
        width: Dimensions.get('window').width - 50,
        borderRadius: 20,
        backgroundColor: '#f3f3f1',
        margin: 10,
        padding: 0,
        paddingLeft: 20
    }
});