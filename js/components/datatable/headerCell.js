import React from 'react'
import {
    View,
    Text,
    Dimensions,
    TouchableHighlight,
    Image
} from 'react-native';

import Style from './style';

class HeaderCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAscending: false
        };
        this.onPress = this.onPress.bind(this);
    }

    render() {
        return (
            <TouchableHighlight
                onPress={this.onPress}
                disabled={!this.props.field.sortable}
                underlayColor={this.props.highlightColor}
                style={{ width: (this.props.field.width || 100), height: 40 }}>
                <View style={[Style.cell, Style.headerCell, this.props.style]}>
                    <Text style={Style.headerContent}>
                        {this.props.field.label}
                    </Text>
                    {this.renderSortIcons()}
                </View>
            </TouchableHighlight>
        );
    }

    renderSortIcons() {
        if (!this.props.field.sortable) {
            return null;
        }

        if (!this.props.isSortedField) {
            return (
                <Image style={Style.sortImage} source={require('./assets/sort.png')} />
            );
        }

        return (
            this.state.isAscending ?
                <Image style={Style.sortImage} source={require('./assets/sort-asc.png')} />
                :
                <Image style={Style.sortImage} source={require('./assets/sort-desc.png')} />
        );

    }

    onPress() {
        this.setState({
            isAscending: !this.state.isAscending
        }, function () {
            this.props.onSort && this.props.onSort(this.props.field, this.state.isAscending);
        });
    }
}

HeaderCell.propTypes = {
    field: React.PropTypes.object.isRequired,
    onSort: React.PropTypes.func,
    isSortedField: React.PropTypes.bool,
    style: React.PropTypes.number,
    highlightColor: React.PropTypes.string,
}


export default HeaderCell;