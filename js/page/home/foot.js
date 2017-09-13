/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';

export default class Foot extends Component {

    constructor(props) {
        super(props);
    }

    _backHome() {
        this.props.navigator.push({ id: '首页', params: {} });
    }

    _gotoMessage() {
        this.props.navigator.push({ id: '消息', params: {} });
    }

    render() {
        return (
            <View style={styles.container}>

                <TouchableWithoutFeedback onPress={this._backHome.bind(this)}>
                    <View style={styles.imgCcontainer}>
                        <Image style={styles.img} source={require('../../../assets/image/foot/home.png')} />
                        <Text style={styles.txt}>首页</Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this._gotoMessage.bind(this)}>
                    <View style={styles.imgCcontainer}>
                        <Image style={styles.img} source={require('../../../assets/image/foot/msg.png')} />
                        <Text style={styles.txt}>消息</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        height: 25,
        width: 25,
        marginLeft: 100,
        marginRight: 100
    },
    txt: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 1,
        marginBottom: 15
    }
});