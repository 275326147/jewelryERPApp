/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import Storage from '../../utils/storage';

export default class Member extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            userInfo: {}
        };
    }

    componentDidMount() {
        Storage.getStorageAsync('currentUser').then((currentUser) => {
            this.setState({
                userInfo: JSON.parse(currentUser)
            });
        });
    }

    _renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.labelText}>{item.key}</Text>
            <Text style={styles.valueText}>{item.value}</Text>
        </View>
    )

    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.imgContainer}>
                        <Image style={styles.headImg} source={require('../../../assets/image/head/head.png')} />
                    </View>
                    <View style={styles.itemContainer}>
                        <Text style={styles.labelText}>姓名</Text>
                        <Text style={styles.valueText}>{this.state.userInfo.realName}</Text>
                    </View>
                    <View style={styles.itemContainer}>
                        <Text style={styles.labelText}>性别</Text>
                        <Text style={styles.valueText}>{this.state.userInfo.sex == 0 ? "男" : "女"}</Text>
                    </View>
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.itemContainer}>
                        <Text style={styles.labelText}>所属公司</Text>
                        <Text style={styles.valueText}>{this.state.userInfo.companyName}</Text>
                    </View>
                    <View style={styles.itemContainer}>
                        <Text style={styles.labelText}>所属门店</Text>
                        <Text style={styles.valueText}>{this.state.userInfo.shopName}</Text>
                    </View>
                    <View style={styles.itemContainer}>
                        <Text style={styles.labelText}>所属职能</Text>
                        <Text style={styles.valueText}>{this.state.userInfo.userRoleName}</Text>
                    </View>
                    <View style={styles.itemContainer}>
                        <Text style={styles.labelText}>绑定手机</Text>
                        <Text style={styles.valueText}>{this.state.userInfo.mobile}</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        height: 200
    },
    imgContainer: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ede9ff'
    },
    headImg: {
        height: 80,
        width: 80
    },
    infoContainer: {
        flex: 1,
        backgroundColor: '#f3f3f1',
        marginTop: 10
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 40,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#f3f3f1'
    },
    labelText: {
        flex: 1,
        fontSize: 13,
        color: '#333333',
        marginLeft: 10
    },
    valueText: {
        flex: 1,
        fontSize: 13,
        color: '#999999',
        textAlign: 'right',
        marginRight: 10
    }
});