import React, { Component } from "react";
import { Modal, ActivityIndicator, View, TouchableOpacity, Alert, StatusBar, Text } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RNFS from "react-native-fs";
import { AppCommon } from "../../commons/commons";
import { popWithUpdate, deleteItem, popToSceneWithUpdate } from "../../commons/utilitiesFunction";
import Loader from "../Loader/Loader";
import ImagePicker from 'react-native-image-crop-picker';
import { Actions } from "react-native-router-flux";

export default class ImageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            isLoading: false,
            currentIndex: this.props.index,
            images: this.props.images,
        }
    }

    handleSave = () => {
        this.setState({ isLoading: true });
        //Save to folder
        let mainPath = RNFS.ExternalDirectoryPath + AppCommon.root_dir;
        var milliseconds = (new Date).getTime();
        let data = this.props.images[this.props.index].base64
        let directory = this.props.directory;
        let that = this;
        let imageName = milliseconds + ".jpg";
        if (directory === (undefined || null)) {
            let folderName = `New_Doc_${milliseconds}`;
            let folderPath = mainPath + "/" + folderName;
            RNFS.mkdir(folderPath).then(function (response) {
                RNFS.writeFile(folderPath + "/" + imageName, data, "base64")
                    .then(function (response) {
                        that.setState({ isLoading: false });
                        popWithUpdate();
                    }).catch(function (error) {
                        that.setState({ isLoading: false });
                        console.log(error);
                    })
            })
        } else {
            RNFS.writeFile(directory + "/" + imageName, data, "base64")
                .then(function (response) {
                    that.setState({ isLoading: false });
                    popWithUpdate();
                }).catch(function (error) {
                    that.setState({ isLoading: false });
                    console.log(error);
                })
        }
    }

    handleEdit = () => {
        this.setState({ isLoading: true });
        ImagePicker.openCropper({
            cropping: true,
            path: this.state.images[this.state.currentIndex].url,
            freeStyleCropEnabled: true,
            width: 1440,
            height: 2560,
            includeBase64: true
        }).then(image => {
            let that = this;
            var url = that.state.images[that.state.currentIndex].url;
            let path = url.substring(0, url.indexOf('?'));
            RNFS.writeFile(path, image.data, "base64")
                .then(response => {
                    popToSceneWithUpdate('merchantDetail');
                }).catch(error => {
                    console.log(error);
                    that.setState({ isLoading: false });
                })
        }).catch(error => {
            this.setState({ isLoading: false });
            console.log(error);
        })
    }

    handleDelete = () => {
        Alert.alert('Delete image', 'Are you sure you want to delete this image?', [
            {
                text: 'Cancel',
                style: "cancel",
                onPress: () => null,
            },
            {
                text: 'OK',
                onPress: () => {
                    this.setState({
                        isLoading: true,
                    })
                    var url=this.state.images[this.state.currentIndex].url;
                    let path = url.substring(0, url.indexOf('?'));
                    // let path = this.state.images[this.state.currentIndex].url;
                    console.log('Current path: ' + path);
                    deleteItem(path).then(result => {
                        console.log('Delete Success');
                        let temp = this.state.images;
                        temp.splice(this.state.currentIndex, 1);
                        //if temp is empty, delete original folder
                        if (temp.length === 0) {
                            console.log('Folder empty');
                            deleteItem(this.props.folderPath).then(result => {
                                console.log('Delete original folder success');
                                popToSceneWithUpdate('_merchant');
                            })
                        } else {
                            this.setState({
                                images: temp,
                                currentIndex: 0,
                                isLoading: false
                            });
                        }
                    }).catch(error => {
                        console.log('Delete Error: ' + error.message);
                        this.setState({
                            isLoading: false,
                        });
                        Alert.alert('Error', error.message);
                    })
                },
            }
        ]);
    };

    handleChange = (index) => {
        this.setState({ currentIndex: index })
    }

    renderFooter() {
        return (
            <View style={{ height: 100, backgroundColor: 'red' }}>
                <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>Footer</Text>
            </View>
        )
    }

    renderHeader() {
        return (
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
                {this.props.mode === "save" ? (
                    <TouchableOpacity
                        onPress={() => this.handleSave()}
                        style={{ margin: 15 }}
                    >
                        <Icon name="content-save" size={30} color="#fff" />
                    </TouchableOpacity>

                ) : (
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "flex-end"
                        }}
                        >
                            <TouchableOpacity
                                onPress={() => this.handleEdit()}
                                style={{ margin: 15 }}
                            >
                                <Icon name="crop-rotate" size={30} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.handleDelete()}
                                style={{ margin: 15, marginLeft: 0 }}
                            >
                                <Icon name="delete" size={30} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )
                }
            </View>
        )
    }

    render() {
        return (
            <Modal visible={this.state.visible} transparent>
                <StatusBar backgroundColor="black" />
                <ImageViewer
                    enableSwipeDown
                    enablePreload
                    imageUrls={this.state.images}
                    loadingRender={() => (
                        <ActivityIndicator color="#424242" animating />
                    )}
                    index={this.state.currentIndex}
                    onSwipeDown={() => Actions.pop()}
                    onChange={this.handleChange}
                    footerContainerStyle={{ width: '100%' }}
                    renderHeader={this.renderHeader.bind(this)}
                // renderFooter={this.renderFooter.bind(this)}
                />
                <Loader loading={this.state.isLoading} />
            </Modal>
        );
    }
}