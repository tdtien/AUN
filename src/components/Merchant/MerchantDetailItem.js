import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image, Dimensions,
} from "react-native";
import { Actions } from "react-native-router-flux";

const screenWidth = Dimensions.get('window').width;
let itemPadding = 10;
let itemWidth = 0;
export default class MerchantDetailItem extends Component {
    constructor(props) {
        super(props);
    }

    handleImageModal = () => {
        var dataProps = [];
        for (var i = 0; i < this.props.data.length; i++) {
            let image = { url: `file://${this.props.data[i].path}`, base64: this.props.dataBase64[i] };
            dataProps.push(image);
        }
        console.log(this.props.dataBase64.length)
        console.log(dataProps);
        console.log(this.props.data.indexOf(this.props.item));
        return dataProps;
    }

    render() {
        itemWidth = (screenWidth - itemPadding * 4) / this.props.columns;
        return (
            <TouchableOpacity style={styles.container} onPress={() => Actions.imageModal({ images: this.handleImageModal(), index: this.props.data.indexOf(this.props.item) })}>
                <Image style={{ width: itemWidth, height: itemWidth * 1.4 }} source={{ isStatic: true, uri: `file://${this.props.item.path}` }} />
            </TouchableOpacity>
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
