import React, { Component } from "react";
import { Modal, ActivityIndicator, View, TouchableOpacity, Alert } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RNFS from "react-native-fs";
import { AppCommon } from "../../commons/commons";

export default class ImageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
        }
    }

    handleSave = () => {
        //Save to folder
        var milliseconds = (new Date).getTime();
        let mainPath = RNFS.ExternalDirectoryPath + AppCommon.root_dir;
        let data = this.props.images[this.props.index].base64
        RNFS.exists(mainPath).then(function (response) {
            if (!response) {
                RNFS.mkdir(mainPath).then(function (response) {
                    RNFS.writeFile(mainPath + "/" + milliseconds + ".jpg", data, "base64")
                        .then(function (response) {
                            Alert.alert('Successful!', 'Image has been saved.').then(function (response) {
                                Actions.pop();
                            });
                        }).catch(function (error) {
                            console.log(error);
                        })
                }).catch(function (error) {
                    console.log(error);
                })
            } else {
                RNFS.writeFile(mainPath + "/" + milliseconds + ".jpg", data, "base64")
                    .then(function (response) {
                        Alert.alert('Successful!', 'Image has been saved.');
                    }).catch(function (error) {
                        console.log(error);
                    })
            }
        })
    }

    render() {
        return (
            <Modal visible={this.state.visible}>
                <ImageViewer
                    enableSwipeDown
                    imageUrls={this.props.images}
                    loadingRender={() => (
                        <ActivityIndicator color="#424242" animating />
                    )}
                    index={this.props.index}
                    renderHeader={() => (
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                        >
                            <TouchableOpacity
                                onPress={() => Actions.pop()}
                                style={{ margin: 15 }}
                            >
                                <Icon name="arrow-left" size={30} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.handleSave()}
                                style={{ margin: 15 }}
                            >
                                <Icon name="content-save" size={30} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                    onSwipeDown={() => Actions.pop()}
                />
            </Modal>
        );
    }
}