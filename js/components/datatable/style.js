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
        borderWidth: 0.5,
        height: 35
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    headerCell: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333'
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