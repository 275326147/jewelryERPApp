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
            type: 1
        };
    }

    lock = false;

    render() {
        this.lock = false;
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
        if (!this.lock) {
            this.lock = true;
            console.log(`e.nativeEvent.data.type = ${e.nativeEvent.data.type}, e.nativeEvent.data.code = ${e.nativeEvent.data.code}`)
            forward(this, 'Track', { type: this.state.type, barCode: e.nativeEvent.data.code });
        }
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