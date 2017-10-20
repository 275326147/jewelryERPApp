import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
    },
    cell: {
        borderColor: '#f3f3f1',
        borderWidth: 0.5,
        textAlign: 'center',
        lineHeight: 35,
        color: '#666'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    headerCell: {
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        lineHeight: 35,
        flex: 1
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    altRow: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f3f3f1'
    },
    contentCell: {
    },
    sortedCell: {
        color: 'grey'
    },
    unsortedCell: {
        color: 'grey'
    }
});