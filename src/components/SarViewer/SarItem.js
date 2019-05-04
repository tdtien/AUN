import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { Icon } from "native-base";
import { Actions } from "react-native-router-flux";
import moment from "moment";
import { AppCommon } from '../../commons/commons';

export default class SarItem extends Component {

    handlePress = () => {
        const { item, type } = this.props;
        if (type !== 'FILE') {
            Actions.textViewer({ data: item.content, title: type.toLowerCase().charAt(0).toUpperCase() + type.toLowerCase().slice(1) })
        } else {
            Actions.pdfViewer({ fileName: item.name, base64: null, link: item.link, flow: null })
        }
    }

    render() {
        const { item, type } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.handlePress()}
            >
                <View style={styles.item}>
                    <View style={styles.leftItem}>
                        {type !== 'FILE' ?
                            (<Icon name={AppCommon.icon("document")} style={styles.icon} />) :
                            (<Icon name='pdffile1' type='AntDesign' style={styles.icon} />)}
                        <View style={styles.content}>
                            <Text style={styles.shortDescription} numberOfLines={2}>
                                {type !== 'FILE' ? item.content : item.name}
                            </Text>
                            <Text style={styles.time}>
                                {moment(this.props.item.createdAt).format('DD/MM/YYYY HH:mm')}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'column'
    },
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
    },
    shortDescription: {
        color: 'black',
        paddingHorizontal: 15,
        fontSize: AppCommon.font_size
    },
    time: {
        color: 'gray',
        paddingLeft: 15,
        fontSize: 15
    },
    icon: {
        color: AppCommon.colors,
        fontSize: AppCommon.icon_largeSize
    }
})