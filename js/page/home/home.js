/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React from 'react';
import PageComponent from '../PageComponent';
import {
    View,
    StyleSheet
} from 'react-native';
import Foot from './foot';
import Center from './center';
import UpgradeDialog from '../upgrade/upgradeDialog';
import Settings from '../user/settings';

export default class Home extends PageComponent {
    componentDidMount() {
        super.componentDidMount('首页');
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

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