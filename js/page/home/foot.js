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
        this.props.navigation.navigate('Home');
    }

    _gotoMessage() {
        this.props.navigation.navigate('Message');
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
        height: 55,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
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
        marginRight: 100,
        marginTop: 5,
    },
    txt: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 1,
        marginBottom: 10
    }
});