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
        const { item, type, downloadMode } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={downloadMode ? null : this.props.onPress}
                onLongPress={this.props.onLongPress}
            >
                <View style={styles.item}>
                    <View style={styles.leftItem}>
                        <Icon name={AppCommon.icon("folder")} style={styles.icon} />
                        <Text style={styles.name} numberOfLines={3}>
                            {typeof type === 'string' && type === 'evidences' ? item.content : item.name}
                        </Text>
                    </View>
                    {downloadMode ? (<CheckBox checked={item.checked} onPress={this.props.toggleChecked}/>) : (<View />)}
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
    name: {
        color: 'black',
        paddingHorizontal: 15,
        fontSize: AppCommon.font_size
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