import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
    },
    cell: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#f3f3f1',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        height: 35
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    headerContent: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333'
    },
    headerCell: {
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    altRow: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5'
    },
    contentCell: {
        textAlign: 'center',
        color: '#666'
    },
    sortImage: {
        width: 14,
        height: 14,
        marginLeft: 5,
        marginTop: 1
    }
});