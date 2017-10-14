/**
 * Created by Meiling.Zhou on 2017/9/10
 */
'use strict';

import React, { Component } from 'react';
import {
    View,
    Dimensions,
    Image
} from 'react-native';
import { forward } from '../../utils/common';

export default class Loading extends Component {
    componentDidMount() {
        let params = this.props.navigation.state.params;
        if (params) {
            forward(this, 'Checking', { item: params.item });
        } else {
            forward(this, 'Home');
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Image style={{
                    marginTop: 80,
                    marginLeft: (Dimensions.get('window').width / 2 - 100),
                    height: 200,
                    width: 200
                }} source={require('../../../assets/image/info/no_result.png')} />
            </View>
        );
    }

}