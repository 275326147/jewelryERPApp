/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React from 'react';
import PageComponent from '../PageComponent';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    FlatList,
    Modal,
    Keyboard,
    Platform
} from 'react-native';
import Spinner from '../../components/loading/loading';
import { callService, handleResult } from '../../utils/service';
import ImagePicker from 'react-native-image-picker';
import { forward, alert, unlockScreen } from '../../utils/common';

export default class Track extends PageComponent {
    constructor(props) {
        super(props);
        this.backRoute = 'Home';
        this.state = {
            loading: false,
            modalVisible: false,
            barCode: '',
            selectGoodsVisible: false,
            goodsList: [],
            type: 1
        };
    }

    componentDidMount() {
        super.componentDidMount('商品跟踪');
        let params = this.props.navigation.state.params;
        if (!params) return;
        let paramType = params.type;
        let paramBarCode = params.barCode;
        if (paramType && paramBarCode) {
            this.setState({
                type: paramType,
                barCode: paramBarCode
            }, () => {
                this.queryGoodsInfo();
            });
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    //1 --进货   2 --调拨   3 --调价   4 --销售   5 --出库   6 --调款   7 --礼品兑换
    colorMap = {
        1: '#ACC2FA',
        2: '#93D987',
        3: '#7AD8C5',
        4: '#F8B5B5',
        5: '#83D0E3',
        6: '#93D987',
        7: '#EBC77D'
    }

    queryGoodsInfo(refresh) {
        let params = new FormData();
        let field = "oldBarCode";
        if (this.state.type === 2 || refresh) {
            field = "barCode";
        } else if (this.state.type === 3) {
            field = "certificateNo";
        }
        let barCode = refresh ? this.state.data.barCode : this.state.barCode;
        if (!barCode || !barCode.trim()) {
            alert(this,
                'info',
                '请输入查询条件');
            return;
        }
        params.append(field, barCode);
        this.setState({
            loading: true,
            barCode: ''
        }, function () {
            callService(this, 'queryGoodsInfo4Track.do', params, function (response) {
                if (response.goodsInfoList && response.goodsInfoList.length > 1) {
                    this.setState({
                        loading: false,
                        selectGoodsVisible: true,
                        goodsList: handleResult(response.goodsInfoList)
                    });
                } else if (response.goodsInfoList && response.goodsInfoList.length === 1) {
                    this.setState({
                        data: response.goodsInfoList[0],
                        steps: handleResult(response.goodsTrackingList)
                    });
                }
                unlockScreen(this);
            }, function () {
                unlockScreen(this);
            });
        });
        Keyboard.dismiss();
    }

    _renderProp = ({ item }) => {
        return (
            <View style={{ height: 20, flexDirection: 'row' }}>
                <Text style={{ flex: 1.2, fontSize: 12, color: '#333' }}>{item.label}</Text>
                <Text style={{ flex: 3, fontSize: 12, color: '#666', textAlign: 'left' }}>{item.value}</Text>
            </View>
        )
    }

    _renderItem = ({ item }) => {
        return (
            <View style={{ height: 250, flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, margin: 10 }}>
                    <View style={[styles.leftTopContainer, { backgroundColor: this.colorMap[item.mainType] }]}>
                        <Text style={{ color: '#fff', fontSize: 13 }}>{item.key}</Text>
                    </View>
                    <View style={[styles.leftBottomContainer, { borderColor: this.colorMap[item.mainType] }]}>
                        <Text style={{ color: this.colorMap[item.mainType], fontSize: 13 }}>{item.typeName}</Text>
                    </View>
                </View>
                <View style={{ width: 1, borderWidth: 0.5, borderColor: '#999', borderStyle: 'dashed' }}></View>
                <View style={{ flex: 3, margin: 10, marginLeft: 15 }}>
                    <View style={[styles.rightTopContainer, { backgroundColor: this.colorMap[item.mainType] }]}>
                        <Text style={{ color: '#fff', fontSize: 12, marginLeft: 10 }}>操作时间：{item.operTime}</Text>
                    </View>
                    <View style={styles.rightBottomContainer}>
                        <FlatList style={{ flex: 1, margin: 10 }} data={handleResult(item.props)} renderItem={this._renderProp} />
                    </View>
                </View>
            </View >
        );
    }

    options = {
        title: '选择图片',
        cancelButtonTitle: '取消',
        takePhotoButtonTitle: '拍照',
        chooseFromLibraryButtonTitle: '图片库',
        cameraType: 'back',
        mediaType: 'photo',
        videoQuality: 'high',
        durationLimit: 10,
        maxWidth: 600,
        maxHeight: 600,
        aspectX: 2,
        aspectY: 1,
        quality: 0.8,
        angle: 0,
        allowsEditing: false,
        noData: false,
        storageOptions: {
            skipBackup: true,
            path: 'images'
        }
    };

    showImagePicker() {
        if (window.currentUser && window.currentUser.mobileRightStr.indexOf("102002") > -1) {
            ImagePicker.showImagePicker(this.options, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                }
                else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                }
                else {
                    let params = new FormData();
                    params.append('imgData', response.data);
                    params.append('fileFixName', response.fileName || `${this.state.data.barCode}.jpg`);
                    params.append('barCode', this.state.data.barCode);
                    params.append('module', 'goods');
                    this.setState({
                        loading: true
                    }, function () {
                        callService(this, 'ajaxUpImg.do', params, function (response) {
                            this.queryGoodsInfo(true);
                        }, function () {
                            unlockScreen(this);
                        });
                    });
                }
            });
        }
    }

    _onClose() {
        this.setState({
            selectGoodsVisible: false
        });
    }

    _selectGoods(item) {
        this._onClose();
        let params = new FormData();
        params.append("barCode", item.barCode);
        this.setState({
            loading: true
        }, function () {
            callService(this, 'queryGoodsTrackList.do', params, function (response) {
                if (response) {
                    this.setState({
                        data: item,
                        steps: handleResult(response.goodsTrackingList)
                    });
                }
                unlockScreen(this);
            }, function () {
                unlockScreen(this);
            });
        });
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
    );

    render() {
        return (
            <ScrollView style={styles.container}>
                <Spinner visible={this.state.loading} textContent={""} textStyle={{ color: '#FFF' }} />
                <Modal
                    visible={this.state.selectGoodsVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => { this._onClose() }}>
                    <View style={styles.modalBackground}>
                        <View style={{ flexDirection: 'row', width: 280, height: 30, backgroundColor: '#fff' }}>
                            <Text style={{ flex: 3, height: 20, marginTop: 10, textAlign: 'center', fontSize: 14, color: '#333' }}>请选择商品记录</Text>
                            <TouchableOpacity onPress={() => { this._onClose() }}>
                                <Image style={{ height: 25, width: 25, marginTop: 5, marginRight: 5 }} source={require('../../../assets/image/head/close.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.modalContainer, { height: (this.state.goodsList.length * 100) }]}>
                            <FlatList style={{ flex: 1 }} data={this.state.goodsList} renderItem={this._renderGoodsItem} />
                        </View>
                    </View>
                </Modal>
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
                    <TouchableOpacity onPress={() => { forward(this, 'Scanner'); }}>
                        <Image style={styles.cameraImg} source={require('../../../assets/image/head/camera.png')} />
                    </TouchableOpacity>
                    <TextInput style={styles.input} placeholder='请输入商品条码'
                        onChangeText={(text) => this.setState({ barCode: text })}
                        value={this.state.barCode}
                        onSubmitEditing={(event) => {
                            this.setState({ barCode: event.nativeEvent.text }, function () {
                                this.queryGoodsInfo();
                            });
                        }}
                        underlineColorAndroid="transparent" />
                    <TouchableWithoutFeedback onPress={() => { this.queryGoodsInfo() }}>
                        <Image style={{ height: 25, width: 25 }} source={require('../../../assets/image/track/search.png')} />
                    </TouchableWithoutFeedback>
                </View>
                {
                    this.state.data ?
                        <View style={{ flex: 1 }}>
                            <View style={styles.baseInfoContainer}>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.showImagePicker(); }}>
                                    {
                                        this.state.data.img ?
                                            <Image style={{ flex: 1, margin: 15 }} source={{ uri: this.state.data.img }} />
                                            :
                                            <Image style={{ width: 100, height: 100, margin: 15 }} source={require('../../../assets/image/track/camera.png')} />
                                    }
                                </TouchableOpacity>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.label, { marginTop: 15 }]}>商品名   <Text style={styles.value}>{this.state.data.goodsName}</Text></Text>
                                    <Text style={styles.label}>条码号   <Text style={styles.value}>{this.state.data.barCode}</Text></Text>
                                    <Text style={styles.label}>原条码   <Text style={styles.value}>{this.state.data.oldBarCode}</Text></Text>
                                    <Text style={styles.label}>子名称   <Text style={styles.value}>{this.state.data.subGoodsName}</Text></Text>
                                    <Text style={styles.label}>证书号   <Text style={styles.value}>{this.state.data.certificateNo}</Text></Text>
                                    <Text style={styles.label}>款    号   <Text style={styles.value}>{this.state.data.styleNo}</Text></Text>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        {
                                            this.state.modalVisible ?
                                                <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }); }}>
                                                    <Image style={styles.arrowImg} source={require('../../../assets/image/track/up.png')} />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={() => { this.setState({ modalVisible: true }); }}>
                                                    <Image style={styles.arrowImg} source={require('../../../assets/image/track/down.png')} />
                                                </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            </View >
                            {
                                this.state.modalVisible ?
                                    <View style={styles.modalContainer}>
                                        <View style={{ borderTopWidth: 1.5, borderColor: '#f3f3f1', margin: 10 }}></View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>款式</Text>
                                            <Text style={styles.detailValue}>{this.state.data.style}</Text>
                                            <Text style={styles.detailLabel}>CIA证书</Text>
                                            <Text style={styles.detailValue}>{this.state.data.giaCertificateNo}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>实际分类</Text>
                                            <Text style={styles.detailValue}>{this.state.data.goodsClassify}</Text>
                                            <Text style={styles.detailLabel}>备注</Text>
                                            <Text style={styles.detailValue}>{this.state.data.remarks}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>主石重</Text>
                                            <Text style={styles.detailValue}>{this.state.data.mainStoneWeight || 0}</Text>
                                            <Text style={styles.detailLabel}>主石数</Text>
                                            <Text style={styles.detailValue}>{this.state.data.mainStoneNum || 0}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>颜色</Text>
                                            <Text style={styles.detailValue}>{this.state.data.mainStoneColor}</Text>
                                            <Text style={styles.detailLabel}>级别</Text>
                                            <Text style={styles.detailValue}>{this.state.data.mainStoneClarity}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>副石重</Text>
                                            <Text style={styles.detailValue}>{this.state.data.subStone1Weight || 0}</Text>
                                            <Text style={styles.detailLabel}>副石数</Text>
                                            <Text style={styles.detailValue}>{this.state.data.subStone1Num || 0}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>副石2重</Text>
                                            <Text style={styles.detailValue}>{this.state.data.subStone2Weight || 0}</Text>
                                            <Text style={styles.detailLabel}>副石2数</Text>
                                            <Text style={styles.detailValue}>{this.state.data.subStone2Num || 0}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>克工费</Text>
                                            <Text style={styles.detailValue}>{this.state.data.labelWorkFee4Ke}</Text>
                                            <Text style={styles.detailLabel}>件工费</Text>
                                            <Text style={styles.detailValue}>{this.state.data.labelWorkFee4Jian}</Text>
                                        </View>
                                    </View>
                                    :
                                    <View></View>
                            }
                            <FlatList style={{ flex: 1, marginTop: 10 }} data={this.state.steps} renderItem={this._renderItem} />
                        </View>
                        :
                        <Image style={styles.img} source={require('../../../assets/image/info/no_follow.png')} />
                }
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    view_title_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        height: 25,
        alignItems: 'center'
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
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        height: 260,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1
    },
    input: {
        fontSize: 16,
        height: 40,
        margin: 10,
        width: (Dimensions.get('window').width - 80),
        borderRadius: 20,
        backgroundColor: '#f3f3f1',
        padding: 0,
        paddingLeft: 20
    },
    searchContainer: {
        height: 60,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    img: {
        marginTop: 80,
        marginLeft: (Dimensions.get('window').width / 2 - 100),
        height: 200,
        width: 200
    },
    cameraImg: {
        height: 25,
        width: 25,
        marginLeft: 10
    },
    arrowImg: {
        marginTop: 10,
        marginLeft: 80
    },
    baseInfoContainer: {
        height: 200,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#f3f3f1'
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginTop: 5
    },
    value: {
        fontSize: 14,
        color: '#666'
    },
    detailLine: {
        height: 32,
        flexDirection: 'row',
        marginLeft: 10
    },
    detailLabel: {
        flex: 1.5,
        fontSize: 13,
        color: '#333'
    },
    detailValue: {
        flex: 2,
        fontSize: 13,
        color: '#666'
    },
    leftTopContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: 80,
        borderRadius: 4
    },
    leftBottomContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        width: 80,
        marginTop: -5,
        backgroundColor: 'transparent',
        borderRadius: 4,
        borderWidth: 1.5
    },
    rightTopContainer: {
        height: 30,
        borderRadius: 3,
        justifyContent: 'center'
    },
    rightBottomContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 3
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
    }
});