import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { merchantStyles } from "./MerchantStyle";
import { Actions } from "react-native-router-flux";

export default class CameraButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity style={merchantStyles.cameraButton} onPress={() => { Actions.camera({ directory: this.props.folderPath }) }}>
                <Icon name={"camera"}
                    size={30}
                    color="white" />
            </TouchableOpacity>
        );
    }
}