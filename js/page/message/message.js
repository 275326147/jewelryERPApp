/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    Dimensions,
    Image
} from 'react-native';
import Foot from '../home/foot';
import messageData from './data';

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    _renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={{ height: 20, flexDirection: 'row', margin: 5, marginLeft: 10 }}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.contentText}>{item.content}</Text>
            </View>
        </View>
    );

    render() {
        return (
            <View style={styles.container}>
                {
                    messageData.length === 0 ?
                        <View style={{ flex: 1 }}>
                            <Image style={styles.resultImg} source={require('../../../assets/image/info/no_result.png')} />
                        </View>
                        :
                        <FlatList style={{ marginTop: 10 }} data={messageData} renderItem={this._renderItem} />
                }
                <Foot navigation={this.props.navigation} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    resultImg: {
        marginTop: 80,
        marginLeft: (Dimensions.get('window').width / 2 - 100),
        height: 200,
        width: 200
    },
    itemContainer: {
        height: 80,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#f3f3f1',
        backgroundColor: '#fff'
    },
    titleText: {
        flex: 1,
        fontSize: 13
    },
    timeText: {
        flex: 1,
        textAlign: 'right',
        fontSize: 13,
        color: '#666'
    },
    contentText: {
        fontSize: 13,
        color: '#999'
    }
});