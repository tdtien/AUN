import React, { Component } from "react";
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text
} from "react-native";
import { Icon, CheckBox } from "native-base";
import { AppCommon } from "../../commons/commons";
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';

export default class SarFolder extends Component {
    render() {
        const { item, type, downloadMode, sceneKey, rootIndex, isConnected } = this.props;
        let isCommentVisible = (isConnected && (sceneKey === 'sarVersions' || sceneKey === 'criterions' || item.key === 'subCriterion')) ? true : false;
        let isSarVersion = sceneKey === 'sarVersions';
        if (item.disable) {
            return <View />
        }
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={downloadMode ? null : this.props.onPress}
                onLongPress={this.props.onLongPress}
            >
                <View style={styles.item}>
                    <View style={isCommentVisible ? styles.leftItemV2 : styles.leftItem} >
                        <Icon name={AppCommon.icon("folder")} style={styles.icon} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={isCommentVisible ? styles.nameV2 : styles.name} numberOfLines={3}>
                                {`${rootIndex}${item.index + 1}. ${typeof type === 'string' && type === 'evidences' ? item.content : item.name}`}
                            </Text>
                            {isSarVersion ? (
                                <Text style={{ color: 'gray', paddingLeft: 15, fontSize: 15 }}>
                                    {item.release ? `${I18n.t(keys.SarExplorer.Main.lblVersionRelease)} ${item.version}` : I18n.t(keys.SarExplorer.Main.lblVersionEditing)}
                                </Text>
                            ) : <View />
                            }
                        </View>
                    </View>
                    {isCommentVisible ? (
                        <View style={styles.commentArea}>
                            <Text style={{ paddingHorizontal: 5, color: item.commentCount > 0 ? AppCommon.colors : '#cccccc' }}>{item.commentCount}</Text>
                            <Icon name="comment" type="MaterialIcons" style={{ color: item.commentCount > 0 ? AppCommon.colors : '#cccccc', fontSize: 13 }} />
                            <Text style={{ paddingHorizontal: 5, color: item.noteCount > 0 ? AppCommon.colors : '#cccccc' }}>{item.noteCount}</Text>
                            <Icon name="note" type="SimpleLineIcons" style={{ color: item.noteCount > 0 ? AppCommon.colors : '#cccccc', fontSize: 13 }} />
                        </View>
                    ) : <View />}
                    {downloadMode ? (<CheckBox checked={item.checked} onPress={this.props.toggleChecked} />) : (<View />)}
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
    },
    leftItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 10
    },
    leftItemV2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 25,
        width: 0,
        flexGrow: 1,
    },
    name: {
        color: 'black',
        paddingHorizontal: 15,
        fontSize: AppCommon.font_size
    },
    nameV2: {
        color: 'black',
        flexShrink: 1,
        paddingHorizontal: 15,
        fontSize: AppCommon.font_size,
    },
    commentArea: {
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    comment: {
        color: '#cccccc',
        paddingRight: 5,
        fontSize: 17
    },
    icon: {
        color: AppCommon.colors,
        fontSize: AppCommon.icon_largeSize
    },
    rightIcon: {
        color: 'darkgray',
        fontSize: AppCommon.icon_size,
        paddingLeft: 20
    }
});