import React, { Component } from "react";
import { ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Text, Icon, View, } from "native-base";
import { isEmptyJson, limitText } from "../../commons/utilitiesFunction";
import { AppCommon } from "../../commons/commons";

const window = Dimensions.get('window');
export default class BreadCrumb extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { isConnected, handlePress, previousItem, currentItem, isUploadFlow, nextItem } = this.props
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ref={ref => this.scrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight) => {
                    if (typeof nextItem === 'undefined') {
                        if (contentWidth > window.width) {
                            this.scrollView.scrollToEnd({ animated: true });
                        } else {
                            this.scrollView.scrollTo({ x: 0, y: 0, animated: false });
                        }
                    }
                }}
            >
                <TouchableOpacity style={styles.rootItem} onPress={() => handlePress(0, true)}>
                    <Icon
                        name={AppCommon.icon(isConnected ? "cloud-outline" : "tv")}
                        type="Ionicons"
                        style={styles.rootIcon}
                    />
                </TouchableOpacity>
                {previousItem.length == 0 ? <View /> : previousItem.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={item.id + index}
                            style={styles.breadCrumbItem}
                            onPress={() => handlePress(index)}
                        >
                            <Icon name="right" type="AntDesign" style={styles.crumbArrow} />
                            <Text style={styles.crumbItem}>
                                {limitText(item.name)}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
                {isEmptyJson(currentItem) ? <View /> :
                    <TouchableOpacity style={styles.breadCrumbItem} disabled>
                        <Icon name="right" type="AntDesign" style={styles.crumbArrow} />
                        <Text style={styles.activeCrumbItem}>
                            {currentItem.hasOwnProperty('type') && currentItem.type === 'EVIDENCE' ?
                                limitText(currentItem.content) : limitText(currentItem.name)}
                        </Text>
                    </TouchableOpacity>
                }
                {(isEmptyJson(nextItem) || nextItem.length == 0) ? <View /> : nextItem.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={item.id + index}
                            style={styles.breadCrumbItem}
                            disabled
                        >
                            <Icon name="right" type="AntDesign" style={styles.crumbArrow} />
                            <Text style={[styles.crumbItem, { color: '#b3b3b3' }]}>
                                {limitText(item.name)}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 40,
        backgroundColor: 'white',
    },
    contentContainer: {
        paddingLeft: 10,
        paddingRight: 10
    },
    rootIcon: {
        color: 'gray',
        fontSize: 20
    },
    rootItem: {
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    breadCrumbItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    crumbItem: {
        color: 'gray'
    },
    activeCrumbItem: {
        color: AppCommon.colors,
    },
    crumbArrow: {
        alignItems: 'center',
        color: 'gray',
        fontSize: 15
    },
})