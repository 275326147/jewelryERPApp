/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity
} from 'react-native';

export default class Follow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput style={styles.input} placeholder='&nbsp;&nbsp;请输入商品条码'
                        underlineColorAndroid="transparent" />
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Scanner', { type: 'track' }); }}>
                        <Image style={styles.cameraImg} source={require('../../../assets/image/head/camera.png')} />
                    </TouchableOpacity>
                </View>
                <Image style={styles.img} source={require('../../../assets/image/info/no_follow.png')} />
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
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
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5
    },
});