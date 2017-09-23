import React, { Component } from 'react';
import {
    View,
    Alert
} from 'react-native';
import { QRScannerView } from 'ac-qrcode';

export default class Scanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lockCamera: false
        };
    }

    render() {
        return (

            < QRScannerView
                onScanResultReceived={this.barcodeReceived.bind(this)}

                renderTopBarView={() => { return (<View></View>) }}

                renderBottomMenuView={() => { return (<View></View>) }}
            />
        )
    }

    _renderTitleBar() {
        return (
            <View></View>
        );
    }

    _renderMenu() {
        return (
            <View></View>
        )
    }

    barcodeReceived(e) {
        if (!this.state.lockCamera) {
            this.setState({ lockCamera: true })
            Alert.alert(
                '提示',
                '条码号：' + e.data + ', 条码类型：' + e.type,
                [
                    { text: 'OK', onPress: () => this.setState({ lockCamera: false }) },
                ],
                { cancelable: false }
            )
        }
    }
}