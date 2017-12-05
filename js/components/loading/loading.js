import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    ActivityIndicator,
    Image,
    TouchableOpacity
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    background: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        flex: 1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute'
    },
    textContent: {
        top: 80,
        height: 50,
        fontSize: 20,
        fontWeight: 'bold'
    }
});

const ANIMATION = ['none', 'slide', 'fade'];
const SIZES = ['small', 'normal', 'large'];

let time = 0;
export default class Spinner extends React.Component {

    constructor(props) {
        super(props);
        this.state = { visible: this.props.visible, textContent: this.props.textContent };
    }

    static propTypes = {
        visible: PropTypes.bool,
        cancelable: PropTypes.bool,
        textContent: PropTypes.string,
        animation: PropTypes.oneOf(ANIMATION),
        color: PropTypes.string,
        size: PropTypes.oneOf(SIZES),
        overlayColor: PropTypes.string
    };

    static defaultProps = {
        visible: false,
        cancelable: false,
        textContent: '',
        animation: 'none',
        color: 'white',
        size: 'large', // 'normal',
        overlayColor: 'rgba(0, 0, 0, 0.25)'
    };

    close() {
        this.setState({ visible: false });
    }

    componentWillReceiveProps(nextProps) {
        const { visible, textContent } = nextProps;
        this.setState({ visible, textContent });
    }

    _handleOnRequestClose() {
        if (this.props.cancelable) {
            this.close();
        }
    }

    _renderDefaultContent() {
        return (
            <View style={styles.background}>
                <ActivityIndicator
                    color={this.props.color}
                    size={this.props.size}
                    style={{ flex: 1 }}
                />
                <View style={styles.textContainer}>
                    <Text style={[styles.textContent, this.props.textStyle]}>{this.state.textContent}</Text>
                </View>
            </View>);
    }

    _renderSpinner() {
        const spinner = (
            <View style={[
                styles.container,
                { backgroundColor: this.props.overlayColor }
            ]} key={`spinner_${Date.now()}`}>
                {this.props.children ? this.props.children : this._renderDefaultContent()}
            </View>
        );

        let now = new Date().getTime();
        if (this.state.visible && now - time < 1000) {
            time = now
            return (<View />);
        }

        return (
            <Modal
                animationType={this.props.animation}
                onRequestClose={() => this._handleOnRequestClose()}
                supportedOrientations={['landscape', 'portrait']}
                transparent
                visible={this.state.visible}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.close()}>
                    {spinner}
                </TouchableOpacity>
            </Modal>
        );

    }

    render() {
        return this._renderSpinner();
    }

}
