import React, { Component } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Actions } from "react-native-router-flux";
import { showImagePicker } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { AppCommon } from "../../commons/commons";
import { Icon } from "native-base";
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';

export default class CameraButton extends Component {

    constructor(props) {
        super(props);
    }

    handlePickImage = () => {
        let options = {
            title: I18n.t(keys.Merchant.CameraButton.lblTitle),
            mediaType: 'photo',
            cameraType: 'back',
            takePhotoButtonTitle: I18n.t(keys.Merchant.CameraButton.lblTakePhoto),
            chooseFromLibraryButtonTitle: I18n.t(keys.Merchant.CameraButton.lblChooseImage),
            cancelButtonTitle: I18n.t(keys.Common.lblCancel),
            customButtons: [
                { name: 'chooseMultipleImage', title: I18n.t(keys.Merchant.CameraButton.lblChooseMultipleImages) }
            ],
            noData: true,
            quality: 1,
        }
        showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                ImagePicker.openPicker({
                    multiple: true,
                    mediaType: 'photo',
                }).then(images => {
                    var imageModelProp = [];
                    images.forEach(image => {
                        imageModelProp.push({ url: image.path });
                    });
                    Actions.imageModal({ images: imageModelProp, index: 0, directory: this.props.folderPath, mode: "save" });
                }).catch(error => {
                    console.log(error);
                })
            } else {
                ImagePicker.openCropper({
                    cropping: true,
                    path: response.uri,
                    freeStyleCropEnabled: true,
                    width: 1440,
                    height: 2560,
                }).then(image => {
                    Actions.imageModal({ images: [{ url: image.path }], index: 0, directory: this.props.folderPath, mode: "save" });
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