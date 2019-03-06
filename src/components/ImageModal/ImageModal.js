import React, { Component } from "react";
import { Modal, ActivityIndicator, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { Actions } from "react-native-router-flux";
import { Button, Text } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


export default class ImageModal extends Component {
    constructor(props) {
        super(props);
        this.state ={
            visible: true
        }
    }

    render() {
        return (
            <Modal visible={this.state.visible} transparent={true}>
                <ImageViewer
                    enableSwipeDown
                    imageUrls={this.props.images}
                    loadingRender={() => (
                        <ActivityIndicator color="#424242" animating />
                    )}
                    renderHeader={() => (
                        <Button transparent style={{alignSelf: "flex-end"}}>
                            <Text style={{color: "white"}}>Export to PDF</Text>
                        </Button>
                    )}
                    renderIndicator={(idx, size) => (
                        <View style={{backgroundColor: "red", flex: 1, justifyContent: "flex-end"}}>
                            <Text>idx</Text>
                        </View>
                    )}
                    onSwipeDown={() => Actions.pop()}
                />  
            </Modal>
        );
    }
}