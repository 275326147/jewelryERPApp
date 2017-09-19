import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Storage from '../../utils/storage';

const splashImg = require('../../../assets/image/start/start.jpg');//加载图片

const { width, height } = Dimensions.get('window');

export default class Start extends Component {
    constructor(props) {
        super(props);
        this.state = {  //这是动画效果
            bounceValue: new Animated.Value(1)
        };
    }

    componentDidMount() {
        Animated.timing(
            this.state.bounceValue, { toValue: 1.2, duration: 1000 }
        ).start();
        this.timer = setTimeout(() => {
            Storage.getStorageAsync('isFrist').then((result) => {
                if (result == null || result == '') {
                    //第一次启动 
                    this.props.navigation.navigate('Guide');
                    Storage.setStorageAsync('isFrist', 'true');
                } else {
                    //第二次启动s
                    this.props.navigation.navigate('Home');
                }
            }).catch((error) => {
                console.log('系统异常' + error);
            });
        }, 1000);
    }

    componentWillUpdate = () => {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <Animated.Image
                style={{
                    width: width,
                    height: height,
                    transform: [{ scale: this.state.bounceValue }]
                }}
                source={splashImg}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    }
});