/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Platform
} from 'react-native';
import Foot from './foot';
import Center from './center';
import UpgradeDialog from '../upgrade/upgradeDialog';

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <UpgradeDialog navigation={this.props.navigation} />
                <Center navigation={this.props.navigation} />
                <Foot navigation={this.props.navigation} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#fff'
    }
});