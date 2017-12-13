import React from 'react';
import PageComponent from '../PageComponent';
import {
    StyleSheet,
    Dimensions,
    View,
    WebView
} from 'react-native';

//获取设备的宽度和高度
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');

//默认应用的容器组件
export default class WebComponent extends PageComponent {
    //渲染
    render() {
        return (
            <View style={styles.container}>
                <WebView scalesPageToFit={true}
                    source={{ uri: this.getUrl(), method: 'GET' }}
                    style={{ width: deviceWidth, height: deviceHeight }}>
                </WebView>
            </View>
        );
    }
}

//样式定义
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});