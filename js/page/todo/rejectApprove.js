import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList
} from 'react-native';
import data from './approveData';

export default class RejectApprove extends Component {

    _getData() {
        let filterData = [];
        data.forEach(function (item) {
            if (item.status === 2) {
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