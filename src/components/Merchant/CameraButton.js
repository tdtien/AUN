import React, { Component } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import { showImagePicker } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { AppCommon } from "../../commons/commons";
import { Icon } from "native-base";

const options = {
    title: 'Import photo',
    mediaType: 'photo',
    cameraType: 'back',
    customButtons: [
        { name: 'chooseMultipleImage', title: 'Choose multiple images from Library...' }
    ],
    quality: 1,
    storageOptions: {
        skipBackup: true,
    },
}
export default class CameraButton extends Component {

    constructor(props) {
        super(props);
    }

    handlePickImage = () => {
        showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                ImagePicker.openPicker({
                    multiple: true,
                    mediaType: 'photo',
                    includeBase64: true
                }).then(images => {
                    var imageModelProp = [];
                    images.forEach(image => {
                        imageModelProp.push({ url: image.path, base64: image.data });
                    });
                    Actions.imageModal({ images: imageModelProp, index: 0, directory: this.props.folderPath, mode: "save"});
                }).catch(error => {
                    console.log(error);
                })
            } else {
                // const source = { uri: response.uri };
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                ImagePicker.openCropper({
                    cropping: true,
                    path: response.uri,
                    freeStyleCropEnabled: true,
                    width: 1440,
                    height: 2560,
                    includeBase64: true
                }).then(image => {
                    Actions.imageModal({ images: [{ url: image.path, base64: image.data }], index: 0, directory: this.props.folderPath, mode: "save" });
                }).catch(error => {
                    console.log(error);
                })
            }
        });
    }

    render() {
        return (
            <TouchableOpacity style={styles.cameraButton} onPress={() => this.handlePickImage()}>
                <Icon name={AppCommon.icon("camera")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    cameraButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        bottom: 20,
        right: 20,
        borderRadius: 60,
        backgroundColor: AppCommon.colors,
        alignItems: 'center',
        justifyContent: 'center',
    }
});