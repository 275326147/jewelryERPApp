/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import Head from './head';
import Foot from './foot';
import Center from './center';

export default class Home extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Head />
                <Center />
                <Foot />
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
    }
});