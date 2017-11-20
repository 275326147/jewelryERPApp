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
import Swipeout from 'react-native-swipeout';
import { callService, handleResult } from '../../utils/service';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageData: []
        }
    }

    _deleteMsg = (item) => {
        let params = new FormData();
        params.append('id', item.id);
        callService(this, 'deleteMessage.do', params, function (response) {
            this.queryMsg();
        });
    }

    queryMsg() {
        callService(this, 'getMessageList.do', new FormData(), function (response) {
            if (response.data) {
                this.setState({
                    messageData: handleResult(response.data)
                });
            }
        });
    }

    componentDidMount() {
        this.queryMsg();
    }


    _renderItem = ({ item }) => (
        <Swipeout right={[{ text: '删除', backgroundColor: 'red', onPress: this._deleteMsg(item) }]}>
            <View style={styles.itemContainer}>
                <View style={{ height: 20, flexDirection: 'row', margin: 5, marginLeft: 10 }}>
                    <Text style={styles.titleText}>{item.msgTypeStr}</Text>
                    <Text style={styles.timeText}>{item.createTime}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.contentText}>{item.msgDtl}</Text>
                </View>
            </View>
        </Swipeout>
    );

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.messageData.length === 0 ?
                        <View style={{ flex: 1 }}>
                            <Image style={styles.resultImg} source={require('../../../assets/image/info/no_result.png')} />
                        </View>
                        :
                        <FlatList style={{ marginTop: 10 }} data={this.state.messageData} renderItem={this._renderItem} />
                }
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