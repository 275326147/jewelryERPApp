import React from 'react'
import {
    Image,
    ScrollView,
    FlatList,
    View,
    Text,
    Dimensions,
    TouchableHighlight,
    Linking,
    LayoutAnimation
} from 'react-native';

import Style from './style';
import Cell from './cell';
import HeaderCell from './headerCell';

class DataTable extends React.Component {
    constructor(props) {
        super(props);

        this.renderHeaderCell = this.renderHeaderCell.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.onSort = this.onSort.bind(this);

        this.state = {
            sortedField: null
        }
    }

    render() {
        return (
            <ScrollView automaticallyAdjustContentInsets={false} horizontal={true} style={[Style.container, this.props.containerStyle]}>
                {this.renderTable()}
            </ScrollView>
        )
    }

    renderHeaderCell(field, i) {
        if (this.props.renderHeaderCell) {
            return this.props.renderHeaderCell(field, i);
        }

        return (
            field.hidden ? <View key={i} /> :
                <HeaderCell
                    key={i}
                    style={this.props.headerCellStyle}
                    highlightColor={this.props.headerHighlightColor}
                    onSort={this.onSort}
                    isSortedField={this.state.sortedField === field}
                    field={field} />
        )
    }

    renderTable() {
        this.uniqueKey(this.props.dataSource);
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={[Style.header, this.props.headerStyle]}>
                    {this.props.fields.map(this.renderHeaderCell)}
                </View>
                <FlatList
                    data={this.props.dataSource}
                    renderItem={this.renderRow} />
            </View>
        );
    }

    renderRow(row, sectionId, rowId) {

        var style = row.index % 2 == 0 ? Style.row : Style.altRow

        if (this.props.filter) {
            return (
                this.props.filter(row, rowId) ?
                    <View
                        style={style}
                        accessible={true}>
                        {this.renderCells(row)}
                    </View>
                    : <View />
            )
        }

        return (
            <View
                style={style}
                accessible={true}>
                {this.renderCells(row)}
            </View>
        )
    }

    renderCells(row) {
        return this.props.fields.map((field, index) => {
            var value = row.item[field.id];
            return (
                field.hidden ? <View key={index} /> :
                    <Cell
                        key={index}
                        width={field.width || 80}
                        style={this.props.cellStyle}
                        label={value} />
            );
        });
    }

    onSort(field, isAscending) {
        if (!this.props.onSort) {
            return;
        }

        this.setState({
            sortedField: field
        });
        this.props.onSort(field, isAscending);
    }

    uniqueKey(list) {
        if (list && list.length > 0) {
            let index = 1;
            list.forEach(function (item) {
                if (item && !item.key) {
                    item.key = index++;
                }
            });
        }
    }
}


DataTable.propTypes = {
    fields: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
        sortable: React.PropTypes.bool
    })),
    onSort: React.PropTypes.func,
    dataSource: React.PropTypes.array.isRequired,
    containerStyle: React.PropTypes.number,
    renderHeaderCell: React.PropTypes.func,
    headerStyle: React.PropTypes.number,
    headerCellStyle: React.PropTypes.number,
    headerHighlightColor: React.PropTypes.string,
    cellStyle: React.PropTypes.number,

}

DataTable.defaultProps = {
    headerHighlightColor: 'gray'
}

export default DataTable;