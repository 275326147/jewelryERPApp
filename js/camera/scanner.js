import React, { Component } from 'react';
import {
    View,
    Alert,
    StyleSheet,
    TouchableOpacity,
    Text,
    DeviceEventEmitter
} from 'react-native';
import { QRScannerView } from 'ac-qrcode';
import { forward } from '../utils/common';

export default class Scanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1,
            lockCamera: false
        };
    }

    render() {
        return (
            < QRScannerView
                onScanResultReceived={this.barcodeReceived.bind(this)}
                topMenuHeight={35}
                hintText={'  '}
                renderTopBarView={() => {
                    return (
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={styles.view_title_container}>
                                <TouchableOpacity onPress={() => { this.setState({ type: 1 }) }}>
                                    <Text style={{ color: this.state.type === 1 ? '#7A67EE' : '#fff', fontSize: 18, marginRight: 60 }}>原条码</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.setState({ type: 2 }) }}>
                                    <Text style={{ color: this.state.type === 2 ? '#7A67EE' : '#fff', fontSize: 18, marginRight: 60 }}>条码</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { this.setState({ type: 3 }) }}>
                                    <Text style={{ color: this.state.type === 3 ? '#7A67EE' : '#fff', fontSize: 18 }}>证书号</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }}

                renderBottomMenuView={() => { return (<View></View>) }}
            />
        )
    }

    barcodeReceived(e) {
        if (!this.state.lockCamera) {
            this.setState({ lockCamera: true });
            forward(this, 'Track', { type: this.state.type, barCode: e.data });
        }
    }
}

const styles = StyleSheet.create({
    view_title_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        height: 35,
        alignItems: 'center'
    }
});