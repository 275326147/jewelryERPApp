import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList
} from 'react-native';
import data from './approveData';

export default class WaitApprove extends Component {

    _getData() {
        let filterData = [];
        data.forEach(function (item) {
            if (item.status === 1) {
                filterData.push(item);
            }
        });
        return filterData;
    }

    _renderItem = ({ item }) => {
        return (
            <View>

            </View >
        );
    }

    render() {
        return (
            <View>

            </View>
        );
    }
}

const styles = StyleSheet.create({

});