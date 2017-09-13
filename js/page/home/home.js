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
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Head navigator={this.props.navigator} />
                <Center navigator={this.props.navigator} />
                <Foot navigator={this.props.navigator} />
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