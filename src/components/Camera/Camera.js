import React, { Component } from "react";
import { StatusBar, StyleSheet, View, TouchableOpacity } from "react-native";
import { RNCamera } from "react-native-camera";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ImagePicker from 'react-native-image-crop-picker';
import Permissions from 'react-native-permissions'

export default class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flashIcon: "-off",
      qualityIcon: "high",
      flashMode: RNCamera.Constants.FlashMode.off,
      imageUrl: [],
      imageDisplay: false,
      quality: 1,
      sound: false,
      soundIcon: "-outline"
    };
  }

  componentDidMount() {
    Permissions.request("camera")
      .then(cameraResponse => {
        console.log("camera permission: " + cameraResponse);
        return (Permissions.request("storage"));
      }).then(storageResponse => {
        console.log("storage permission: " + storageResponse);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={this.state.flashMode}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          captureAudio={false}
          playSoundOnCapture={this.state.sound}
          ratio="16:9"
        >
          {({ camera }) => {
            return (
              <View style={{ flex: 1, justifyContent: "space-between" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => Actions.pop()}
                    style={styles.button}
                  >
                    <Icon name="arrow-left" size={30} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.changeQuality()}
                    style={styles.button}
                  >
                    <Icon
                      name={"quality-" + this.state.qualityIcon}
                      size={30}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.toggleSound()}
                    style={styles.button}
                  >
                    <Icon
                      name={"bell" + this.state.soundIcon}
                      size={30}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.changeFlashMode()}
                    style={styles.button}
                  >
                    <Icon
                      name={"flash" + this.state.flashIcon}
                      size={30}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => this.takePicture(camera)}
                    style={styles.button}
                  >
                    <Icon name="circle-slice-8" size={80} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        </RNCamera>
      </View>
    );
  }

  takePicture = async camera => {
    const options = {
      fixOrientation: true,
      quality: this.state.quality,
      pauseAfterCapture: true
    };
    const data = await camera.takePictureAsync(options);
    ImagePicker.openCropper({
      cropping: true,
      path: data.uri,
      freeStyleCropEnabled: true,
      width: 1000,
      height: 1000,
      includeBase64: true
    }).then(image => {
      Actions.imageModal({ images: [{ url: image.path, base64: image.data }], index: 0, directory: this.props.directory });
    }).catch(function (error) {
      console.log(error);
      ImagePicker.cleanSingle(data.uri);
    })
  };

  changeFlashMode = () => {
    if (this.state.flashIcon === "") {
      this.setState({
        flashIcon: "-auto",
        flashMode: RNCamera.Constants.FlashMode.auto
      });
    }
    if (this.state.flashIcon === "-auto") {
      this.setState({
        flashIcon: "-off",
        flashMode: RNCamera.Constants.FlashMode.off
      });
    }
    if (this.state.flashIcon === "-off") {
      this.setState({
        flashIcon: "",
        flashMode: RNCamera.Constants.FlashMode.on
      });
    }
  };

  changeQuality = () => {
    if (this.state.qualityIcon === "high") {
      this.setState({
        quality: 0.75,
        qualityIcon: "medium"
      });
    }
    if (this.state.qualityIcon === "medium") {
      this.setState({
        quality: 0.5,
        qualityIcon: "low"
      });
    }
    if (this.state.qualityIcon === "low") {
      this.setState({
        quality: 1,
        qualityIcon: "high"
      });
    }
  };

  toggleSound = () => {
    if (this.state.sound) {
      this.setState({ sound: false, soundIcon: "-outline" });
    } else {
      this.setState({ sound: true, soundIcon: "" });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black"
  },
  preview: {
    flex: 1,
    flexDirection: "column"
  },
  button: {
    margin: 15
  }
});
