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
    TouchableWithoutFeedback,TouchableOpacity,
    Keyboard
} from 'react-native';
import Spinner from '../../components/loading/loading';
import { callService, handleResult } from '../../utils/service';
import { alert ,forward} from '../../utils/common';

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
        super.componentDidMount('会员管理');
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
        console.log('====', item)
        let src = '';
        let typeName = '';
        switch (item.vipCardLevelId) {
            case 1:
                src = require('../../../assets/image/member/diamond.png');
                typeName = '钻石会员卡';
                break;
            case 2:
                src = require('../../../assets/image/member/gold.png');
                typeName = '黄金会员卡';
                break;
            case 3:
                src = require('../../../assets/image/member/silver.png');
                typeName = '白银会员卡';
                break;
            default:
                src = require('../../../assets/image/member/vip_p.png');
                typeName = '普通会员卡';
                break;
        }
        
        return (
            <TouchableOpacity onPress={() => { forward(this, 'MemberInfo');}} style={styles.itemContainer}>
                <Image style={styles.img} source={src}>
                    <View style={styles.itemRow}>
                        <View style={styles.item}>
                            <Image style={styles.useImg} source={require('../../../assets/image/member/user.png')}/>
                            <View style={styles.userInfo}>
                                <Text numberOfLines={1} style={[styles.userName,styles.textColor]}>{item.cusName}</Text>
                                <Text numberOfLines={1} style={[styles.shopName,styles.textColor]}>{item.shopName}</Text>
                            </View>
                            <Text style={[styles.vip,styles.textColor]}>{typeName}</Text>
                        </View>
                    </View>
                    <Text style={[styles.mobile,styles.textColor]}>{
                        item.mobile.replace(/\B(?=(\d{4})+(?!\d))/g,' ')
                        
                    }</Text>
                </Image>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={{ flex: 1,backgroundColor:'#fff',paddingVertical:10}}>
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
                        <Image style={{ height: 17, width: 16 }} source={require('../../../assets/image/track/search1.png')} />
                    </TouchableWithoutFeedback>
                </View>
                {
                    this.state.memberList.length === 0 ?
                        <Image style={styles.resultImg} source={require('../../../assets/image/info/no_result.png')} />
                        :
                        <FlatList style={{ flex: 1, marginTop: 30 }} data={this.state.memberList} renderItem={this._renderItem} />
                }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    input: {
        fontSize: 16,
        height: 27,
        flex:1,
        margin: 2,
        padding: 0,
        paddingLeft: 15,
        fontSize:14
    },
    searchContainer: {
        marginLeft:15,
        paddingRight:15,
        width: screenWidth - 30,
        borderRadius: 20,
        height: 31,
        backgroundColor: '#EDEDED',
        alignItems: 'center',
        flexDirection: 'row'
    },
    img: {
        resizeMode: Image.resizeMode.stretch,
        width: screenWidth-30,
        height: 350/(screenWidth-30)*120 
    },
    resultImg: {
        marginTop: 80,
        marginLeft: (screenWidth / 2 - 100),
        height: 200,
        width: 200
    },
    itemContainer: {
        paddingHorizontal:15,
        height: screenWidth < 400 ? 160 : 190,
        marginBottom: 10
    },
    

    itemRow:{
        flexDirection:'row',
        paddingVertical:20,
        paddingHorizontal:20,
    },
    item:{
        flexDirection:'row',
        alignItems:'center',
        flex:1,
    },
    useImg:{
        width:42,
        height:42,
        marginRight:10
    },textColor:{
        color:'#fff',
        backgroundColor:'transparent'
    },userName:{
        fontSize:24,
        fontWeight:'500',
        width:150,
    },shopName:{
        fontSize:16,
        width:150,
    },vip:{
        fontSize:18,
        width:100,
        textAlign:'right',
    },mobile:{
        fontSize:20,
        paddingLeft:20
    }
});