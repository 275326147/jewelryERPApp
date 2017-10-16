import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import Barcode from 'react-native-smart-barcode';
import { forward } from '../utils/common';

export default class Scanner extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            type: 1,
            lock: false
        };
    }

    render() {
        this._startScan();
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.view_title_container}>
                    <TouchableOpacity onPress={() => { this.setState({ type: 1 }) }}>
                        <Text style={{ color: this.state.type === 1 ? '#7A67EE' : '#999', fontSize: 18, marginRight: 60 }}>原条码</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ type: 2 }) }}>
                        <Text style={{ color: this.state.type === 2 ? '#7A67EE' : '#999', fontSize: 18, marginRight: 60 }}>条码</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.setState({ type: 3 }) }}>
                        <Text style={{ color: this.state.type === 3 ? '#7A67EE' : '#999', fontSize: 18 }}>证书号</Text>
                    </TouchableOpacity>
                </View>
                <Barcode style={{ flex: 1, }}
                    ref={component => this._barCode = component}
                    onBarCodeRead={this._onBarCodeRead} />
            </View>
        )
    }

    _onBarCodeRead = (e) => {
        if (!this.state.lock) {
            this.setState({
                lock: true
            });
            console.log(`e.nativeEvent.data.type = ${e.nativeEvent.data.type}, e.nativeEvent.data.code = ${e.nativeEvent.data.code}`)
            this._stopScan();
            forward(this, 'Track', { type: this.state.type, barCode: e.nativeEvent.data.code });
        }
    }

    _startScan = (e) => {
        if (this._barCode) this._barCode.startScan();
    }

    _stopScan = (e) => {
        if (this._barCode) this._barCode.stopScan();
    }

}

const styles = StyleSheet.create({
    view_title_container: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        height: 35,
        alignItems: 'center'
    }
});