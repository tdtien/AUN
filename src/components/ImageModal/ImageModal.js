import React, { Component } from "react";
import { Modal, ActivityIndicator, View, TouchableOpacity, Alert, StatusBar, Text, Platform } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { Icon } from "native-base";
import RNFS from "react-native-fs";
import { AppCommon } from "../../commons/commons";
import { popWithUpdate, deleteItem, popToSceneWithUpdate, fileToBase64 } from "../../commons/utilitiesFunction";
import Loader from "../Loader/Loader";
import ImagePicker from 'react-native-image-crop-picker';
import { Actions } from "react-native-router-flux";
import DialogInput from "react-native-dialog-input";
import moment from "moment";

export default class ImageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            isLoading: false,
            currentIndex: this.props.index,
            images: this.props.images,
            folderName: '',
            isDialogVisible: false,
        }
    }

    handleSave = (name, index) => {
        this.setState({ isLoading: true });
        let mainPath = AppCommon.directoryPath + AppCommon.root_dir;
        let currentMilis = moment().valueOf();
        fileToBase64(this.state.images[index].url).then(data => {
            let that = this;
            let imageName = currentMilis + ".jpg";
            if (name === '') {
                name = 'New_Doc_' + currentMilis;
            }
            let folderPath = mainPath + "/" + name;
            RNFS.mkdir(folderPath)
                .then((response) => {
                    RNFS.writeFile(folderPath + "/" + imageName, data, "base64")
                        .then(function (response) {
                            if (++index < that.state.images.length) {
                                that.handleSave(name, index);
                            } else {
                                that.setState({ isLoading: false });
                                popWithUpdate();
                            }
                        }).catch(error => {
                            console.log(error);
                            that.setState({ isLoading: false });
                            popWithUpdate();
                        })
                }).catch(error => {
                    console.log(error);
                    that.setState({ isLoading: false });
                    popWithUpdate();
                })
        }).catch(error => console.log(error));
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
                    popToSceneWithUpdate('merchantDetail', { version: Math.random() });
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
                    var url = this.state.images[this.state.currentIndex].url;
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
                                popToSceneWithUpdate('_merchant', { version: Math.random() });
                            })
                        } else {
                            let index = 0;
                            if (this.state.currentIndex !== 0) {
                                index = this.state.currentIndex - 1;
                            }
                            this.setState({
                                images: temp,
                                currentIndex: index,
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

    render() {
        return (
            <Modal visible={this.state.visible} transparent>
                <StatusBar backgroundColor="black" />
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: 'black',
                    ...Platform.select({
                        ios: {
                            paddingTop: 20,
                        },
                    }),
                }}
                >
                    <TouchableOpacity
                        onPress={() => popWithUpdate()}
                        style={{ margin: 15 }}
                    >
                        <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                    {this.props.mode === "save" ? (
                        <TouchableOpacity
                            onPress={() => {
                                if (this.props.directory === (undefined || null)) {
                                    this.setState({ isDialogVisible: true });
                                } else {
                                    let name = this.props.directory.substring(this.props.directory.lastIndexOf('/'), this.props.directory.length);
                                    this.handleSave(name, 0);
                                }
                            }}
                            style={{ margin: 15 }}
                        >
                            <Icon name={AppCommon.icon("save")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
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
                                    <Icon name={AppCommon.icon("crop")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.handleDelete()}
                                    style={{ margin: 15, marginLeft: 0 }}
                                >
                                    <Icon name={AppCommon.icon("trash")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>
                <ImageViewer
                    enableSwipeDown
                    enablePreload
                    imageUrls={this.state.images}
                    loadingRender={() => (
                        <ActivityIndicator color={AppCommon.colors} animating />
                    )}
                    style={{ flex: 1 }}
                    index={this.state.currentIndex}
                    onSwipeDown={() => Actions.pop()}
                    onChange={this.handleChange}
                    footerContainerStyle={{ width: '100%' }}
                // renderHeader={this.renderHeader.bind(this)}
                // renderFooter={this.renderFooter.bind(this)}
                />
                <Loader loading={this.state.isLoading} />
                <DialogInput isDialogVisible={this.state.isDialogVisible}
                    title={"Set name for doc"}
                    hintInput={"New_Doc_<milisecond>"}
                    submitText={"Set"}
                    submitInput={(inputText) => { this.handleSave(inputText, 0) }}
                    closeDialog={() => { this.showDialog(false) }}>
                </DialogInput>
            </Modal>
        );
    }
}