/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';

export default class Center extends Component {

    render() {
        return (
            <View style={{flex:1}}>
                <Image style={styles.img} source={require('./image/start/start.jpg')} />
                <View style={styles.iconContainer}>

                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    img:{
        height: 80
    },
    iconContainer: {
       height: 120,
       backgroundColor: '#f3f3f1'
    }
});