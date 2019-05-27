import React, { Component } from "react";
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text
} from "react-native";
import { Icon, CheckBox } from "native-base";
import { AppCommon } from "../../commons/commons";

export default class SarFolder extends Component {
    render() {
        const { item, type, downloadMode, sceneKey, rootIndex, isConnected } = this.props;
        let isCommentVisible = (isConnected && (sceneKey === 'sars' || sceneKey === 'criterions' || item.key === 'subCriterion')) ? true : false;
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={downloadMode ? null : this.props.onPress}
                onLongPress={this.props.onLongPress}
            >
                <View style={styles.item}>
                    <View style={isCommentVisible ? styles.leftItemV2 : styles.leftItem} >
                        <Icon name={AppCommon.icon("folder")} style={styles.icon} />
                        <Text style={isCommentVisible ? styles.nameV2 : styles.name} numberOfLines={3}>
                            {`${rootIndex}${item.index + 1}. ${typeof type === 'string' && type === 'evidences' ? item.content : item.name}`}
                        </Text>
                    </View>
                    {isCommentVisible ? (
                        <View style={styles.commentArea}>
                            <Text style={styles.comment}>{item.commentCount}</Text>
                            <Icon name="comment" type="MaterialIcons" style={{ color: '#cccccc', fontSize: 13 }} />
                            <Text style={styles.comment}>{' ' + item.noteCount}</Text>
                            <Icon name="note" type="SimpleLineIcons" style={{ color: '#cccccc', fontSize: 13 }} />
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
        width: 0,
        flexGrow: 1
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
        fontSize: AppCommon.font_size
    },
    commentArea: {
        flexDirection: 'row',
        alignItems: 'center',
        right: 0
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