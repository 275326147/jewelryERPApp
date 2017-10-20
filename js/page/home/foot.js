/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { forward } from '../../utils/common';

export default class Foot extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { forward(this, 'Todo') }}>
                    <View style={styles.imgContainer}>
                        <Image style={styles.img} source={require('../../../assets/image/foot/todo.png')} />
                        <Text style={styles.txt}>我的待办</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ flex: 1 }} onPress={() => { forward(this, 'Message') }}>
                    <View style={styles.imgContainer}>
                        <Image style={styles.img} source={require('../../../assets/image/foot/msg.png')} />
                        <Text style={styles.txt}>消息</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderColor: '#f3f3f1',
        height: 55,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    imgContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        height: 25,
        width: 25,
        marginTop: 5
    },
    txt: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 3,
        marginBottom: 5
    }
});