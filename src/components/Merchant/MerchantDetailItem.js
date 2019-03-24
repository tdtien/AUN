import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image, Dimensions,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { folderToBase64 } from "../../commons/utilitiesFunction";

const screenWidth = Dimensions.get('window').width;
let itemPadding = 10;
let itemWidth = 0;
export default class MerchantDetailItem extends Component {
    constructor(props) {
        super(props);
    }

    handleImageModal = () => {
        folderToBase64(this.props.data).then(response => {
            var dataProps = [];
            for (var i = 0; i < this.props.data.length; i++) {
                let image = { url: `file://${this.props.data[i].path}`, base64: response[i] };
                dataProps.push(image);
            }
            console.log(dataProps);
            var props = {images: dataProps, index: this.props.data.indexOf(this.props.item)};
            Actions.imageModal(props);
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        itemWidth = (screenWidth - itemPadding * 4) / this.props.columns;
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.handleImageModal()}>
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
