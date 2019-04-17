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
        let item = this.props.item;
        let iconName;
        let timeView;
        let arrowView;
        if (type !== 'evidences') {
            iconName = "filetext1";
            timeView = <Text style={{ color: 'gray', paddingLeft: 15, fontSize: 15 }}>{moment(this.props.item.createdAt).format('DD/MM/YYYY HH:mm')}</Text>;
            arrowView = <Icon name='angle-right' type="FontAwesome5" style={{ color: 'gray', fontSize: AppCommon.icon_size, paddingLeft: 20 }} />;
        } else {
            iconName = "folder1";
            timeView = null;
            arrowView = null
        }
        let pressAction = function () {
            if (type !== 'evidences') {
                Actions.textViewer({ data: item.content, title: type });
            } else {
                Actions.evidenceViewer({ suggestionId: item.id });
            }
        }
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => pressAction()}>
                <View style={styles.item}>
                    <View style={styles.leftItem}>
                        <Icon name={iconName} type="AntDesign" style={{ color: 'deepskyblue', fontSize: AppCommon.icon_largeSize }} />
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={{ color: 'black', paddingHorizontal: 15, fontSize: AppCommon.font_size }} numberOfLines={3}>{item.content}</Text>
                            {
                                (type !== "evidences") ? (
                                    <Text style={{ color: 'gray', paddingLeft: 15, fontSize: 15 }}>{moment(this.props.item.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                                ) : null
                            }
                        </View>
                    </View>
                    {
                        (type === "evidences") ? (
                            <Icon name='angle-right' type="FontAwesome5" style={{ color: 'gray', fontSize: AppCommon.icon_size, paddingLeft: 20 }} />
                        ) : null
                    }
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