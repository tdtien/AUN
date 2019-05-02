import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {
    Icon,
} from 'native-base';
import { AppCommon } from '../../commons/commons';
import { Actions } from 'react-native-router-flux';

export default class FolderItem extends Component {
    constructor(props) {
        super(props);
    }

    handleDetail = () => {
        // if (Actions.currentScene == '_sarViewer') {
            this.props.parentView.detail(this.props.item);
        // } else {
            // this.props.parentView.handlePush(this.props.item);
        // }
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.5}
                onLongPress={() => this.props.parentView.handleShowFooter(this.props.item)}
                onPress={() => this.handleDetail()}
            >
                <View style={styles.item}>
                    <View style={styles.leftItem}>
                        <Icon name={AppCommon.icon("folder")} style={{ color: AppCommon.colors, fontSize: AppCommon.icon_largeSize }} />
                        <Text style={{ color: 'black', paddingHorizontal: 15, fontSize: AppCommon.font_size }} numberOfLines={3}>{this.props.item.name}</Text>
                    </View>
                    <Icon name='angle-right' type="FontAwesome5" style={{ color: 'darkgray', fontSize: AppCommon.icon_size, paddingLeft: 20 }} />
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