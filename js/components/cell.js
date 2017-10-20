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
            <Text style={[Style.cell, Style.contentCell, this.props.style, { width: this.props.width }]}>
                {this.props.label}
            </Text>
        );
    }
}

Cell.propTypes = {
    label: React.PropTypes.any.isRequired,
    style: React.PropTypes.number,
}


export default Cell;