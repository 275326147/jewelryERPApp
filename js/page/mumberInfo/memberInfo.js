/**
 * 2018/3/19
 * maoyaoping
 */
'use strict';

import React from 'react';
import PageComponent from '../PageComponent';
import {Platform,View,ScrollView,Text,DeviceEventEmitter,StyleSheet,Image,Dimensions,PixelRatio,TextInput,TouchableOpacity} from 'react-native';
import { createForm } from 'rc-form';
import moment from 'moment';
import ActionSheet from 'antd-mobile/lib/action-sheet';
import DatePicker from 'antd-mobile/lib/date-picker';  
import List from 'antd-mobile/lib/list';  

import {ImagePicker} from '../../components/ImagePicker/imagePicker';

const maxDate = moment(new Date(), 'YYYY-MM-DD Z').utcOffset(8);
const minDate = moment('1900-01-01 +0800', 'YYYY-MM-DD Z').utcOffset(8);
//import upload from '../../components/ImagePicker/upload'
import { alert } from '../../utils/common';
let screenWidth = Dimensions.get('window').width;
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
      onTouchStart: e => e.preventDefault(),
    };
}

class memberInfo extends PageComponent {
    
    constructor(props) {
        super(props);
        this.backRoute = 'Member';
        this.state = {
            sex:0,      //0男1女
            date: maxDate,
        };
    }

    componentDidMount() {
        super.componentDidMount('会员信息');
        this.subscription = DeviceEventEmitter.addListener('refreshSubUserInfo',() =>{
            alert(this,'info','保存成功');
       })
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.subscription.remove();
    }
    
    async ImagePicker(){
        let imgInfo = await ImagePicker()
        console.log('imgInfo====', imgInfo)
    }
    showActionSheet = () => {
        const BUTTONS = ['男', '女', '取消'];
        ActionSheet.showActionSheetWithOptions({
          options: BUTTONS,
          cancelButtonIndex: BUTTONS.length - 1,
          message: '性别修改',
          maskClosable: true,
          wrapProps,
        },
        (buttonIndex) => {
            
            if(buttonIndex ==0 || buttonIndex==1){
                this.setState({
                    sex:buttonIndex
                })
            }
          
        });
      }
    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        
        return (
            <View style={{ flex: 1,backgroundColor:'#eee',paddingVertical:10}}>
                <View style={styles.itemHead}>
                    <Text style={[styles.lableText]}>头像</Text>
                    <TouchableOpacity style={[styles.flex]} onPress={() => this.ImagePicker()}>
                        <Image style={styles.useImg} source={require('../../../assets/image/member/user.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.center}>
                    <View style={styles.item}>
                        <Text style={[styles.lableText]}>累计积分</Text>
                        <Text style={[styles.textStyles,{color:'#FF2020',textAlign:'right'}]}>2406</Text>
                    </View>
                    <View style={styles.line}/>
                    <View style={[styles.item]}>
                        <Text style={[styles.lableText]}>累计消费</Text>
                        <Text style={[styles.textStyles,{color:'#FF2020',textAlign:'right'}]}>24060</Text>
                    </View>
                </View>
                <View style={[styles.center,{marginBottom:0}]}>
                    <View style={styles.item}>
                        <Text style={[styles.lableText]}>会员姓名</Text>
                        <TextInput style={styles.input} underlineColorAndroid='transparent'
                            placeholderTextColor='#333'
                            placeholder='王尼玛' 
                            onChangeText={(text) => {
                            this.setState({ userName: text});
                            }}
                            />
                        <Image style={styles.arrowImg} source={require('../../../assets/image/member/arrow.png')}/>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.item}>
                        <Text style={[styles.lableText]}>会员电话</Text>
                        <TextInput style={styles.input} underlineColorAndroid='transparent'
                            placeholderTextColor='#333'
                            placeholder='17688916501' 
                            onChangeText={(text) => {
                            this.setState({ userName: text});
                            }}
                            />
                        <Image style={styles.arrowImg} source={require('../../../assets/image/member/arrow.png')}/>
                    </View>
                    <View style={styles.line}/>
                    <TouchableOpacity onPress ={() => this.showActionSheet()} style={styles.item}>
                        <Text style={[styles.lableText]}>性&nbsp;&nbsp;&nbsp;&nbsp;别</Text>
                        <Text style={[styles.textStyles,]}>{this.state.sex==0 ?'男':'女'}</Text>
                        <Image style={styles.arrowImg} source={require('../../../assets/image/member/arrow.png')}/>
                    </TouchableOpacity>
                    <View style={styles.line}/>
                </View >
                <DatePicker mode="date" title=""
                    {...getFieldProps('Time', {
                        initialValue: this.state.date,
                    }) }
                    minDate={minDate}
                    maxDate={maxDate}
                    extra="请选择">
                    <List.Item arrow="horizontal"><Text style={[styles.lableText]}>会员生日</Text></List.Item>
                </DatePicker>
                <View style={[styles.center,{marginTop:10}]}>
                    <View style={styles.item}>
                        <Text style={[styles.lableText]}>卡&nbsp;&nbsp;&nbsp;&nbsp;号</Text>
                        <Text style={[styles.textStyles,{color:'#999999',textAlign:'right'}]}>{('00000000000').replace(/\B(?=(\d{4})+(?!\d))/g,' ')}</Text>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.item}>
                        <Text style={[styles.lableText]}>会员等级</Text>
                        <Text style={[styles.textStyles,{color:'#999999',textAlign:'right'}]}>普通会员</Text>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.item}>
                        <Text style={[styles.lableText]}>发卡门店</Text>
                        <Text style={[styles.textStyles,{color:'#999999',textAlign:'right'}]}>金展店</Text>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.item}>
                        <Text style={[styles.lableText]}>发卡日期</Text>
                        <Text style={[styles.textStyles,{color:'#999999',textAlign:'right'}]}>2018-02-15</Text>
                    </View>
                </View>
                
            </View>
        );
    }

}

const styles = StyleSheet.create({
    itemHead:{
        height:70,
        width:screenWidth,
        flexDirection:'row',
        backgroundColor:'#fff',
        paddingHorizontal:15,
        paddingVertical:10,
        alignItems:'center',
        marginBottom:10,
    },center:{
        backgroundColor:'#fff',
        paddingHorizontal:15,
        marginBottom:10
    },lableText:{
        width:90,
        fontSize:16,
        color:'#333',
    },textStyles:{
        fontSize:16,
        color:'#333',
        flex:1,
    },flex:{
        flex:1,
    },useImg:{
        width:50,
        height:50,
        alignSelf:'flex-end'
    },item:{
        height:44,
        width:screenWidth-30,
        
        flexDirection:'row',
        alignItems:'center',
    },line:{
        height:1 / PixelRatio.get(),
        width:(screenWidth-30),
        backgroundColor:'#D3D3D3'
    },arrowImg:{
        width:8,
        height:14,
    },input:{
        flex: 1,
        color: '#333',
        fontSize: 16,
        padding: 5,
    }
});

export default createForm()(memberInfo)