/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';
import React from 'react';
import Route from './route/route';
import JPushModule from 'jpush-react-native';
import {
    View,
    Platform,
    Modal,
    ActivityIndicator,
    StyleSheet,
    NativeAppEventEmitter,
    DeviceEventEmitter
} from 'react-native';

export default class JewelryERPApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            animating: false
        }
    }

    componentWillUnmount() {
        JPushModule.removeReceiveCustomMsgListener();
        JPushModule.removeReceiveNotificationListener();
        NativeAppEventEmitter.removeAllListeners();
        DeviceEventEmitter.removeAllListeners();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Modal
                    visible={this.state.animating}
                    transparent={true}
                    onRequestClose={() => { this.setState({ animating: false }) }}>
                    <View style={styles.modalBackground}>
                        <ActivityIndicator
                            animating={this.state.animating}
                            style={styles.centering}
                            color="white"
                            size="large"
                        />
                    </View>
                </Modal>
                <Route />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    centering: {
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    }
});