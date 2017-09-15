/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image
} from 'react-native';

export default class QueryCheck extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.img} source={require('../../../assets/image/info/no_result.png')} />
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
    img: {
        marginTop: 80,
        marginLeft: (Dimensions.get('window').width / 2 - 100),
        height: 200,
        width: 200
    }
});