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
import moment from "moment";
import { Actions } from "react-native-router-flux";

export default class SuggestionTypeItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let type = this.props.sType;
        let itemContent = this.props.item.content;
        let iconName = (type !== 'evidences') ? "filetext1" : "folder1"
        var pressAction = function() {
            if (type !== 'evidences') {
                // Actions.textFile({data: this.props.item.content});
               Actions.textViewer({data: itemContent, title: type});
            } else {
                alert('OK');
            }
        }
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => pressAction()}>
                <View style={styles.item}>
                    <View style={styles.leftItem}>
                        <Icon name={iconName} type="AntDesign" style={{ color: 'deepskyblue', fontSize: AppCommon.icon_largeSize }} />
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={{ color: 'black', paddingHorizontal: 20, fontSize: 20 }} numberOfLines={3}>{itemContent}</Text>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={{ color: 'gray', paddingLeft: 20, fontSize: 15 }}>{moment(this.props.item.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                            </View>
                        </View>
                    </View>
                    <Icon name={AppCommon.icon('more')} style={{ color: 'gray', fontSize: AppCommon.icon_size }} />
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
        justifyContent: 'flex-start'
    }
});