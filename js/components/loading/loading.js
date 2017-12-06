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
    }
});

const ANIMATION = ['none', 'slide', 'fade'];
const SIZES = ['small', 'normal', 'large'];

let time = 0;
export default class Spinner extends React.Component {

    constructor(props) {
        super(props);
        this.state = { visible: this.props.visible };
    }

    static propTypes = {
        visible: PropTypes.bool,
        cancelable: PropTypes.bool,
        animation: PropTypes.oneOf(ANIMATION),
        color: PropTypes.string,
        size: PropTypes.oneOf(SIZES),
        overlayColor: PropTypes.string
    };

    static defaultProps = {
        visible: false,
        cancelable: true,
        animation: 'none',
        color: 'white',
        size: 'large', // 'normal',
        overlayColor: 'rgba(0, 0, 0, 0.25)'
    };

    close() {
        this.setState({ visible: false });
    }

    componentWillReceiveProps(nextProps) {
        let now = new Date().getTime();
        if (!nextProps.visible || now - time > 1000) {
            const { visible } = nextProps;
            this.setState({ visible });
        }
        if (nextProps.visible) time = now;
    }

    _handleOnRequestClose() {
        if (this.props.cancelable) {
            this.close();
        }
    }

    _renderDefaultContent() {
        return (
            <TouchableOpacity style={styles.background} onPress={() => this.close()}>
                <ActivityIndicator
                    animating={this.state.visible}
                    color={this.props.color}
                    size={this.props.size}
                    style={{ height: 80, alignItems: 'center', justifyContent: 'center' }}
                />
            </TouchableOpacity>);
    }

    _renderSpinner() {
        const spinner = (
            <TouchableOpacity style={[
                styles.container,
                { backgroundColor: this.props.overlayColor }
            ]} onPress={() => this.close()}>
                {this.props.children ? this.props.children : this._renderDefaultContent()}
            </TouchableOpacity>
        );

        return (
            <Modal
                animationType={'none'}
                onRequestClose={() => this.close()}
                supportedOrientations={['landscape', 'portrait']}
                transparent={true}
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
