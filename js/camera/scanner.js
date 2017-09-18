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
        let type = this.props.navigation.state.params.type;
        Toast.show('Type: ' + e.type + '\nData: ' + e.data);
        //console.log(e)
    }
}