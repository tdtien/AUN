import React, { Component } from "react";
import {
    View,
    ImageBackground,
    Text,
    StyleSheet,
    TouchableHighlight,
    Alert,
    Image
} from "react-native";
import { Actions } from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome'

export default class MerchantItem extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.item);
    }

    handleClickItem(imageList) {
        Actions.merchantDetail({ imageList: imageList })
    }

    render() {
        return (
            <TouchableHighlight onPress={() => this.handleClickItem(this.props.item.imageList)}>
                <View style={styles.container}>
                    <Image style={styles.image} source={this.props.item.imageList[0].image} />
                    <View style={styles.information}>
                        <Text style={styles.title}>{this.props.item.imageList[0].name}</Text>
                        <View style={styles.subTitle}>
                            <Text style={styles.subText}>{this.props.item.imageList[0].date}</Text>
                            <Text style={styles.subText}>{this.props.item.imageList[0].time}</Text>
                            <View style={styles.badgeCount}>
                                <Text style={styles.badgeText}>{this.props.item.count}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        position: "relative",
        backgroundColor: "white",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ECE9E9'
    },
    image: {
        width: 140,
        height: 100,
        padding: 0
    },
    information: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 20
    },
    title: {
        fontSize: 20,
        color: 'black',
        paddingTop: 2
    },
    subTitle: {
        flex: 1,
        flexDirection: 'row',
    },
    subText: {
        paddingRight: 10,
        paddingTop: 7,
        fontSize: 15
    },
    badgeCount: {
        borderRadius: 3,
        height: 16,
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 9,
    },
    badgeText: {
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 12
    }
});
