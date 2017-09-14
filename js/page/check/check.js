/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Image,
    Text
} from 'react-native';

export default class Check extends Component {
    constructor(props) {
        super(props);
    }

    _gotoPage(url) {
        this.props.navigation.navigate(url);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', height: 60 }}>
                    <TouchableWithoutFeedback onPress={() => { this._gotoPage('NewCheck') }}>
                        <View style={[styles.menuContainer, { borderRightWidth: 1, borderColor: '#f3f3f1' }]}>
                            <Image style={styles.menuImg} source={require('../../../assets/image/check/newCheck.png')} />
                            <Text style={styles.menuText}>新建盘点</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { this._gotoPage('QueryCheck') }}>
                        <View style={styles.menuContainer}>
                            <Image style={styles.menuImg} source={require('../../../assets/image/check/queryCheck.png')} />
                            <Text style={styles.menuText}>盘点单查询</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View>

                </View>
                <Image style={{ marginTop: 50, marginLeft: 60, height: 200, width: 200 }} source={require('../../../assets/image/info/no_check.png')} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    menuContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    menuImg: {
        height: 35,
        width: 35
    },
    menuText: {
        fontSize: 13,
        color: '#999',
        marginLeft: 10
    }
});