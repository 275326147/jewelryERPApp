/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import Datatable from '../../components/datatable/datatable';
import data from './data';

export default class Center extends Component {

    constructor(props) {
        super(props);
        this.fields = [{
            id: 'name',
            label: '姓名',
            sortable: true,
        }, {
            id: 'sex',
            label: '性别',
            sortable: true
        }, {
            id: 'age',
            label: '年龄',
            sortable: true
        }];
    }

    render() {
        return (
            <View style={styles.container}>
                <Datatable
                    dataSource={data}
                    fields={this.fields} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
    }
});