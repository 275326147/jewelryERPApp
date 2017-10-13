/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
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
    FlatList,
    Modal,
    Platform
} from 'react-native';
import { callService, handleResult } from '../../utils/service';
import ImagePicker from 'react-native-image-picker';
import { forward } from '../../utils/common';

export default class Follow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            barCode: '',
            selectGoodsVisible: false,
            goodsList: [],
            type: 1
        };
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

    queryGoodsInfo() {
        let params = new FormData();
        let field = "barCode";
        if (this.state.type === 2) {
            field = "oldBarCode";
        } else if (this.state.type === 3) {
            field = "certificateNo";
        }
        params.append(field, this.state.barCode);
        callService(this, 'queryGoodsInfo4Track.do', params, function (response) {
            if (response.goodsInfoList && response.goodsInfoList.length > 1) {
                this.setState({
                    selectGoodsVisible: true,
                    goodsList: handleResult(response.goodsInfoList)
                });
            } else if (response.goodsInfoList && response.goodsInfoList.length === 1) {
                this.setState({
                    data: response.goodsInfoList[0],
                    steps: handleResult(response.goodsTrackingList)
                });
            }
        });
        this.setState({
            barCode: ''
        });
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
        ImagePicker.showImagePicker(this.options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else {
                let source;
                if (Platform.OS === 'android') {
                    source = { uri: response.uri, isStatic: true }
                } else {
                    source = { uri: response.uri.replace('file://', ''), isStatic: true }
                }

                let file;
                if (Platform.OS === 'android') {
                    file = response.uri
                } else {
                    file = response.uri.replace('file://', '')
                }
                this.setState({
                    loading: true
                });
                this.props.onFileUpload(file, response.fileName || '未命名文件.jpg')
                    .then(result => {
                        this.setState({
                            loading: false
                        })
                    })
            }
        });
    }

    _onClose() {
        this.setState({
            selectGoodsVisible: false
        });
    }

    _selectGoods(item) {
        let params = new FormData();
        params.append("barCode", item.barCode);
        callService(this, 'queryGoodsTrackList.do', params, function (response) {
            this.setState({
                data: item,
                steps: handleResult(response.goodsTrackingList)
            });
        });
        this._onClose();
    }

    _renderGoodsItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => { this._selectGoods(item) }}>
            <View style={styles.menuContainer}>
                <Text style={styles.menuText}>{item.archivesNo}</Text>
                <Text style={styles.menuText}>{item.goodsName}</Text>
                <Text style={styles.menuText}>{item.barCode}</Text>
            </View>
        </TouchableWithoutFeedback>
    );

    render() {
        return (
            <ScrollView style={styles.container}>
                <Modal
                    visible={this.state.selectGoodsVisible}
                    animationType={'slide'}
                    transparent={true}
                    onRequestClose={() => this._onClose()}>
                    <View style={styles.modalBackground}>
                        <View style={[styles.modalContainer, { height: (this.state.goodsList.length * 50) }]}>
                            <FlatList style={{ flex: 1 }} data={this.state.goodsList} renderItem={this._renderGoodsItem} />
                        </View>
                    </View>
                </Modal>
                <View style={styles.view_title_container}>
                    <TouchableOpacity onPress={() => { this.setState({ type: 1 }) }}>
                        <Text style={{ color: this.state.type === 1 ? '#7A67EE' : '#999', fontSize: 14, marginRight: 60 }}>原条码</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ type: 2 }) }}>
                        <Text style={{ color: this.state.type === 2 ? '#7A67EE' : '#999', fontSize: 14, marginRight: 60 }}>条码</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ type: 3 }) }}>
                        <Text style={{ color: this.state.type === 3 ? '#7A67EE' : '#999', fontSize: 14 }}>证书号</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.searchContainer}>
                    <TextInput style={styles.input} placeholder='&nbsp;&nbsp;请输入商品条码'
                        onChangeText={(text) => this.setState({ barCode: text })}
                        value={this.state.barCode}
                        underlineColorAndroid="transparent" />
                    <TouchableWithoutFeedback onPress={() => { this.queryGoodsInfo() }}>
                        <Image style={{ height: 17, width: 16, marginTop: 5, marginLeft: -30 }} source={require('../../../assets/image/track/search.png')} />
                    </TouchableWithoutFeedback>
                    <TouchableOpacity onPress={() => { forward(this, 'Scanner', { type: 'track' }) }}>
                        <Image style={styles.cameraImg} source={require('../../../assets/image/head/camera.png')} />
                    </TouchableOpacity>
                </View>
                {
                    this.state.data ?
                        <View style={{ flex: 1 }}>
                            <View style={styles.baseInfoContainer}>
                                <TouchableOpacity onPress={() => { this.showImagePicker(); }}>
                                    {
                                        this.state.data.img ?
                                            <Image style={{ width: 80, height: 80, margin: 15 }} source={{ uri: this.state.data.img }} />
                                            :
                                            <Image style={{ width: 80, height: 80, margin: 15 }} source={require('../../../assets/image/track/camera.png')} />
                                    }
                                </TouchableOpacity>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.label, { marginTop: 15 }]}>商品代码      <Text style={styles.value}>{this.state.data.archivesNo}</Text></Text>
                                    <Text style={styles.label}>商品名称      <Text style={styles.value}>{this.state.data.goodsName}</Text></Text>
                                    <Text style={styles.label}>子名称          <Text style={styles.value}>{this.state.data.subGoodsName}</Text></Text>
                                    <Text style={styles.label}>供应商          <Text style={styles.value}>{this.state.data.supplierName}</Text></Text>
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
                                            <Text style={styles.detailLabel}>条码号</Text>
                                            <Text style={styles.detailValue}>{this.state.data.barCode}</Text>
                                            <Text style={styles.detailLabel}>原条码号</Text>
                                            <Text style={styles.detailValue}>{this.state.data.oldBarCode}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>证书号</Text>
                                            <Text style={styles.detailValue}>{this.state.data.certificateNo}</Text>
                                            <Text style={styles.detailLabel}>GIA证书</Text>
                                            <Text style={styles.detailValue}>{this.state.data.giaCertificateNo}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>款式</Text>
                                            <Text style={styles.detailValue}>{this.state.data.style}</Text>
                                            <Text style={styles.detailLabel}>款号</Text>
                                            <Text style={styles.detailValue}>{this.state.data.styleNo}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>实际分类</Text>
                                            <Text style={styles.detailValue}>{this.state.data.goodsClassify}</Text>
                                            <Text style={styles.detailLabel}>备注</Text>
                                            <Text style={styles.detailValue}>{this.state.data.remarks}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>主石重</Text>
                                            <Text style={styles.detailValue}>{this.state.data.mainStoneWeight}</Text>
                                            <Text style={styles.detailLabel}>主石数</Text>
                                            <Text style={styles.detailValue}>{this.state.data.mainStoneNum}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>颜色</Text>
                                            <Text style={styles.detailValue}>{this.state.data.mainStoneColor}</Text>
                                            <Text style={styles.detailLabel}>级别</Text>
                                            <Text style={styles.detailValue}>{this.state.data.mainStoneClarity}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>副石重</Text>
                                            <Text style={styles.detailValue}>{this.state.data.subStone1Weight}</Text>
                                            <Text style={styles.detailLabel}>副石数</Text>
                                            <Text style={styles.detailValue}>{this.state.data.subStone1Num}</Text>
                                        </View>
                                        <View style={styles.detailLine}>
                                            <Text style={styles.detailLabel}>副石2数重</Text>
                                            <Text style={styles.detailValue}>{this.state.data.subStone2Weight}</Text>
                                            <Text style={styles.detailLabel}>副石2数</Text>
                                            <Text style={styles.detailValue}>{this.state.data.subStone2Num}</Text>
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
        flexDirection: 'row',
        height: 50,
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
        height: 200,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1
    },
    input: {
        fontSize: 12,
        height: 25,
        marginLeft: 10,
        marginTop: 10,
        width: (Dimensions.get('window').width - 50),
        borderRadius: 15, backgroundColor: '#f3f3f1',
        padding: 0
    },
    searchContainer: {
        height: 40,
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
        height: 18,
        width: 18,
        marginLeft: 30,
        marginRight: 10,
        marginTop: 5
    },
    arrowImg: {
        marginTop: 10,
        marginLeft: 80
    },
    baseInfoContainer: {
        height: 130,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#f3f3f1'
    },
    label: {
        fontSize: 12,
        color: '#333',
        marginTop: 5
    },
    value: {
        fontSize: 12,
        color: '#666'
    },
    detailLine: {
        height: 20,
        flexDirection: 'row',
        marginLeft: 10
    },
    detailLabel: {
        flex: 1.5,
        fontSize: 12,
        color: '#333'
    },
    detailValue: {
        flex: 2,
        fontSize: 12,
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
    }
});