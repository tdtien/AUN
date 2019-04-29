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
        let flow = this.props.flow;
        let isConnected = this.props.isConnected;
        let iconName;
        let timeView;
        let arrowView;
        if (type !== 'evidences') {
            iconName = "filetext1";
            timeView = <Text style={{ color: 'gray', paddingLeft: 15, fontSize: 15 }}>{moment(this.props.item.createdAt).format('DD/MM/YYYY HH:mm')}</Text>;
            arrowView = null;
        } else {
            iconName = "folder1";
            timeView = null;
            arrowView = <Icon name='angle-right' type="FontAwesome5" style={{ color: 'darkgray', fontSize: AppCommon.icon_size, paddingLeft: 20 }} />;
        }
        let pressAction = function () {
            if (type !== 'evidences') {
                if (isConnected) {
                    Actions.textViewer({ data: item.content, title: type });
                } else {
                    Actions.textViewer({ data: item.name, title: type });
                }
            } else {
                let newFlow = { 
                    sarInfo: flow.sarInfo, 
                    criterionInfo: flow.criterionInfo, 
                    subCriterionInfo: flow.subCriterionInfo, 
                    suggestionInfo: item, 
                    isConnected: isConnected, 
                    offlineSuggestionData: item
                }
                Actions.evidenceViewer(newFlow);
            }
        }
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => pressAction()}>
                <View style={styles.item}>
                    <View style={styles.leftItem}>
                        <Icon name={iconName} type="AntDesign" style={{ color: 'deepskyblue', fontSize: AppCommon.icon_largeSize }} />
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={{ color: 'black', paddingHorizontal: 15, fontSize: AppCommon.font_size }} numberOfLines={3}>{isConnected ? item.content : item.name}</Text>
                            {
                                timeView
                            }
                        </View>
                    </View>
                    {
                        arrowView
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