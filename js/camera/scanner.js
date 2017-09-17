import React, { Component } from 'react';
import {
    View,
    Toast
} from 'react-native';
import { QRScannerView } from 'ac-qrcode';

export default class Scanner extends Component {
    render() {
        return (

            < QRScannerView
                onScanResultReceived={this.barcodeReceived.bind(this)}

                renderTopBarView={() => this._renderTitleBar()}

                renderBottomMenuView={() => this._renderMenu()}
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
        Toast.show('Type: ' + e.type + '\nData: ' + e.data);
        //console.log(e)
    }
}