import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { merchantStyles } from "./MerchantStyle";
import { Actions } from "react-native-router-flux";
import { showImagePicker } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { AppCommon } from "../../commons/commons";
import { Icon } from "native-base";

export default class CameraButton extends Component {

    constructor(props) {
        super(props);
    }

    handlePickImage = () => {
        showImagePicker(null, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
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
                }).catch(function (error) {
                    console.log(error);
                })
            }
        });
    }

    render() {
        return (
            <TouchableOpacity style={merchantStyles.cameraButton} onPress={() => this.handlePickImage()}>
                <Icon name={AppCommon.icon("camera")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
            </TouchableOpacity>
        );
    }
}