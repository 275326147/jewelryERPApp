'use strict';
import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
    Alert,
    Image,
    Platform
} from 'react-native';

// 返回操作，用于导航栏的返回
import goBack from './goBack';

// navigationBar 的固定left\title\right 布局好诡异，只能用算的了，flex 各种问题
const screenWidth = Dimensions.get('window').width, btnWidth = 68;

const styles = StyleSheet.create({
    title: {
        flex: 1,
        width: screenWidth - 4 * 2 - btnWidth * 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Platform.OS === 'android' ? 20 : 0
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
        color: '#333333'
    },
    img: {
        height: 20,
        width: 20,
        margin: 10
    }
});

const NavigationBar = {

    Title(route, navigator, index, navState) {
        return (
            <View style={styles.title}>
                <Text style={styles.text}>{route.id}</Text>
            </View>
        );
    },
    LeftButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity style={[styles.btn]} onPress={() => { goBack(navigator); }}>
                <Image style={styles.img} source={require('../../assets/image/head/arrow.png')} />
            </TouchableOpacity>
        );
    },
    RightButton(route, navigator, index, navState) {
        return <View />;
    }
}

export default NavigationBar;