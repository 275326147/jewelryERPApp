/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React from 'react';
import PageComponent from '../PageComponent';
import {
    Platform,
    View,
    ScrollView,
    Text,
    StyleSheet,
    Image,
    FlatList,
    Dimensions,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import Spinner from '../../components/loading/loading';
import { callService, handleResult } from '../../utils/service';
import { alert } from '../../utils/common';

let screenWidth = Dimensions.get('window').width;
export default class Member extends PageComponent {
    constructor(props) {
        super(props);
        this.backRoute = 'Home';
        this.state = {
            loading: false,
            keyword: '',
            memberList: []
        };
    }

    componentDidMount() {
        super.componentDidMount('会员查询');
        this.refs.input && this.refs.input.focus();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    queryMemberList() {
        let params = new FormData();
        let keyword = this.state.keyword;
        if (!keyword || !keyword.trim()) {
            alert(this,
                'info',
                '请输入查询条件');
            return;
        }
        params.append("keyword", keyword);
        callService(this, 'queryCustomer.do', params, function (response) {
            let result = response.customerList;
            if (result && result.length > 0) {
                this.setState({
                    memberList: handleResult(result)
                });
                return;
            }
            alert(this,
                'info',
                '没有相关查询信息');
        });
        this.setState({ keyword: '' });
        Keyboard.dismiss();
    }

    _renderItem = ({ item }) => {
        let src = '';
        let typeName = '';
        switch (item.vipCardLevelId) {
            case 1:
                src = require('../../../assets/image/member/diamond.png');
                typeName = '钻石卡';
                break;
            case 2:
                src = require('../../../assets/image/member/gold.png');
                typeName = '金卡';
                break;
            case 3:
                src = require('../../../assets/image/member/silver.png');
                typeName = '银卡';
                break;
            default:
                src = require('../../../assets/image/member/normal.png');
                typeName = '普卡';
                break;
        }
        return (
            <View style={styles.itemContainer}>
                <Image style={styles.img} source={src}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 2 }}>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    会员姓名
                            </Text>
                                <Text style={styles.valueText}>
                                    {item.cusName}
                                </Text>
                                <View style={styles.type}>
                                    <Text style={{ fontSize: 10, color: '#333' }}>
                                        {typeName}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    会员电话
                            </Text>
                                <Text style={styles.valueText}>
                                    {item.mobile}
                                </Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    {Platform.OS === 'android' ? '性        别' : '性       别'}
                                </Text>
                                <Text style={styles.valueText}>
                                    {item.sex === 1 ? "男" : "女"}
                                </Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    {Platform.OS === 'android' ? '卡        号' : '卡       号'}
                                </Text>
                                <Text style={styles.valueText}>
                                    {item.vipCardNo}
                                </Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    会员生日
                            </Text>
                                <Text style={styles.valueText}>
                                    {item.birthdayStr}
                                </Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    发卡门店
                            </Text>
                                <Text style={styles.valueText}>
                                    {item.shopName}
                                </Text>
                            </View>
                            <View style={styles.item}>
                                <Text style={styles.labelText}>
                                    发卡日期
                            </Text>
                                <Text style={styles.valueText}>
                                    {item.sendDate}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={[styles.marItem, { borderBottomWidth: 2, borderColor: '#f3f3f1' }]}>
                                <Text style={styles.markLabel}>
                                    累计积分
                            </Text>
                                <Text style={styles.markValue}>
                                    {item.pointTotal}
                                </Text>
                            </View>
                            <View style={styles.marItem}>
                                <Text style={[styles.markLabel, { marginTop: 10 }]}>
                                    累计消费
                            </Text>
                                <Text style={styles.markValue}>
                                    {item.consumpAmountTotal}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Image>
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Spinner visible={this.state.loading} textContent={""} textStyle={{ color: '#FFF' }} />
                <View style={styles.searchContainer}>
                    <TextInput ref="input" style={styles.input} placeholder='请输入会员卡号／会员名／手机号'
                        onChangeText={(text) => this.setState({ keyword: text })}
                        value={this.state.keyword}
                        onSubmitEditing={(event) => {
                            this.setState({ keyword: event.nativeEvent.text }, function () {
                                this.queryMemberList();
                            });
                        }}
                        underlineColorAndroid="transparent">
                    </TextInput>
                    <TouchableWithoutFeedback onPress={() => { this.queryMemberList() }}>
                        <Image style={{ height: 28, width: 28 }} source={require('../../../assets/image/track/search.png')} />
                    </TouchableWithoutFeedback>
                </View>
                {
                    this.state.memberList.length === 0 ?
                        <Image style={styles.resultImg} source={require('../../../assets/image/info/no_result.png')} />
                        :
                        <FlatList style={{ flex: 1, marginTop: 10 }} data={this.state.memberList} renderItem={this._renderItem} />
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    input: {
        fontSize: 16,
        height: 40,
        width: screenWidth - 50,
        borderRadius: 20,
        backgroundColor: '#f3f3f1',
        margin: 10,
        padding: 0,
        paddingLeft: 20
    },
    searchContainer: {
        height: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row'
    },
    img: {
        resizeMode: Image.resizeMode.stretch,
        width: screenWidth,
        height: screenWidth < 400 ? 160 : 190
    },
    resultImg: {
        marginTop: 80,
        marginLeft: (screenWidth / 2 - 100),
        height: 200,
        width: 200
    },
    itemContainer: {
        height: screenWidth < 400 ? 160 : 190,
        marginBottom: 10
    },
    item: {
        height: screenWidth < 400 ? 16 : 20,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        marginTop: 5
    },
    markItem: {
        height: 45,
        flexDirection: 'column'
    },
    markLabel: {
        marginTop: 20,
        marginRight: 10,
        textAlign: 'right',
        backgroundColor: 'transparent',
        fontSize: screenWidth < 400 ? 14 : 16,
        color: '#999'
    },
    markValue: {
        marginTop: 5,
        marginRight: 10,
        fontSize: screenWidth < 400 ? 14 : 16,
        textAlign: 'right',
        backgroundColor: 'transparent',
        color: 'orange',
        marginBottom: 5
    },
    labelText: {
        fontSize: screenWidth < 400 ? 13 : 15,
        color: '#333',
        marginLeft: 10,
        marginRight: 20
    },
    valueText: {
        fontSize: screenWidth < 400 ? 13 : 15,
        color: '#999',
        marginRight: 20
    },
    type: {
        marginLeft: 20,
        borderRadius: 2,
        height: 15,
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0EAD3'
    }
});