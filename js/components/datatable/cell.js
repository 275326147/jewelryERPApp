import React from 'react'
import {
    View,
    Text,
    Dimensions,
    TouchableHighlight
} from 'react-native';

import Style from './style';

class Cell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[Style.cell, this.props.style, { width: this.props.width }]}>
                <Text style={Style.contentCell}>
                    {this.props.label}
                </Text>
            </View>
        );
    }
}

Cell.propTypes = {
    label: React.PropTypes.any,
    style: React.PropTypes.number,
}


export default Cell;