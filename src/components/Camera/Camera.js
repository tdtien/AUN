import { Button, Container, Icon, Text, View } from "native-base";
import React, { Component } from "react";
import { StatusBar, StyleSheet, Modal, Image } from "react-native";
import { RNCamera } from "react-native-camera";
import { Actions } from "react-native-router-flux";
import ImageViewer from 'react-native-image-zoom-viewer';
import Images from "../../assets/images";

const PendingView = () => (
  <Container
    style={{
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <Text>Waiting</Text>
  </Container>
);

export default class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flashIcon: 'off',
      flashMode: RNCamera.Constants.FlashMode.off,
      imageUrl: [],
      imageDisplay: false,
    }
    // this.state.imageUrl.push({props: {source: Images.logo}})
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        {this.state.imageDisplay ? <Modal visible={this.state.imageDisplay} transparent={true}>
          <ImageViewer imageUrls={this.state.imageUrl} enableSwipeDown onCancel={() => this.setState({imageDisplay: false})} />
        </Modal> :
          <RNCamera
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={this.state.flashMode}
            permissionDialogTitle={"Permission to use camera"}
            permissionDialogMessage={
              "We need your permission to use your camera phone"
            }
            captureAudio={false}
          >
            {({ camera, status }) => {
              if (status !== "READY") return <PendingView />;
              return (
                <View style={{ flex: 1, justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Button transparent onPress={() => Actions.pop()}>
                      <Icon name='ios-arrow-back' style={{ color: "#fff", fontSize: 30 }} />
                    </Button>
                    <Button transparent onPress={() => this.changeFlashMode()}>
                      <Icon name={'flash-' + this.state.flashIcon} style={{ color: "#fff", fontSize: 30 }} type="MaterialIcons" />
                    </Button>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      onPress={() => this.takePicture(camera)}
                      icon
                      transparent
                      style={{ margin: 15 }}
                    >
                      <Icon
                        style={{ fontSize: 40, color: "#fff" }}
                        name="camera"
                        type="FontAwesome5"
                      />
                    </Button>
                  </View>
                </View>
              );
            }}
          </RNCamera>
        }
      </View>
    );
  }

  takePicture = async function (camera) {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    this.state.imageUrl.unshift({url: data.uri})
    this.setState({ imageDisplay: true })
  };

  changeFlashMode = () => {
    if (this.state.flashIcon === 'on') {
      this.setState({ flashIcon: 'auto', flashMode: RNCamera.Constants.FlashMode.auto })
    }
    if (this.state.flashIcon === 'auto') {
      this.setState({ flashIcon: 'off', flashMode: RNCamera.Constants.FlashMode.off })
    }
    if (this.state.flashIcon === 'off') {
      this.setState({ flashIcon: 'on', flashMode: RNCamera.Constants.FlashMode.on })
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
    flexDirection: "column",
  },
});
