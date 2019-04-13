import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Alert
} from 'react-native';
import {
    Content,
    Container,
    Icon,
    Header,
    Body,
    Title,
} from 'native-base';
import { AppCommon } from '../../commons/commons';
import { Actions } from 'react-native-router-flux';
import { getAllSars } from '../../api/accountApi';
import Loader from '../Loader/Loader'

export default class FolderItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.props.parentView.detail(this.props.item.id)}>
                <View style={styles.item}>
                    <View style={styles.leftItem}>
                        <Icon name='folder1' type="AntDesign" style={{ color: 'deepskyblue', fontSize: AppCommon.icon_largeSize }} />
                        <Text style={{ color: 'black', paddingHorizontal: 20, fontSize: 20 }}>{this.props.item.name}</Text>
                    </View>
                    <Icon name='angle-right' type="FontAwesome5" style={{ color: 'gray', fontSize: AppCommon.icon_size, paddingLeft: 20}} />
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ECE9E9',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    leftItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    }
});