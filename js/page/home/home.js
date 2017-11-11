/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import Foot from './foot';
import Center from './center';
import UpgradeDialog from '../upgrade/upgradeDialog';
import Settings from '../user/settings';
import Storage from '../../utils/storage';
//import JPushModule from 'jpush-react-native';

export default class Home extends Component {
    // componentDidMount() {
    //     Storage.getStorageAsync('currentAccount').then((currentAccount) => {
    //         JPushModule.setAlias(currentAccount, function (args) {
    //             console.info('设置成功：', args);
    //         });
    //     });
    // }

    render() {
        return (
            <View style={styles.container}>
                <Center navigation={this.props.navigation} />
                <Foot navigation={this.props.navigation} />
                <UpgradeDialog navigation={this.props.navigation} />
                <Settings navigation={this.props.navigation} />
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