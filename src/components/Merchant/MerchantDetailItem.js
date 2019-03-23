import React, { Component } from "react";
import {
    View,
    ImageBackground,
    Text,
    StyleSheet,
    TouchableHighlight,
    Alert,
    Image, Dimensions,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'

const screenWidth = Dimensions.get('window').width;
let itemPadding = 10;
let itemWidth = 0;
export default class MerchantDetailItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        itemWidth = (screenWidth - itemPadding * 4) / this.props.columns;
        return (
            <View style={styles.container}>
                <Image style={{ width: itemWidth, height: itemWidth * 1.4 }} source={{ isStatic: true, uri: `file://${this.props.item.path}` }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#F7F5F5",
        padding: 10,
    },
});
