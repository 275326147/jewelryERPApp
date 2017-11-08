/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';
import React from 'react';
import Route from './route/route';
import JPushModule from 'jpush-react-native';
import { View, Platform, BackHandler, Modal, ActivityIndicator, StyleSheet } from 'react-native';

export default class JewelryERPApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            animating: false
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', function () {
            this.exitApp();
            return false;
        });
        if (Platform.OS === 'android') {
            // 在收到点击事件之前调用此接口
            JPushModule.notifyJSDidLoad((resultCode) => { });

            JPushModule.addReceiveNotificationListener((map) => {
                console.log("alertContent: " + map.alertContent);
                console.log("extras: " + map.extras);
                // var extra = JSON.parse(map.extras);
                // console.log(extra.key + ": " + extra.value);
            });

            JPushModule.addReceiveOpenNotificationListener((map) => {
                console.log("Opening notification!");
                console.log("map.extra: " + map.key);
                JPushModule.jumpToPushActivity("jewelryERPApp");
            });

            JPushModule.addGetRegistrationIdListener((registrationId) => {
                console.log("Device register succeed, registrationId " + registrationId);
            });
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress');
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