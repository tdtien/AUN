import { Button, Container, Icon, Text, View } from "native-base";
import React, { Component } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { RNCamera } from "react-native-camera";

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
  render() {
    return (
      <Container>
        <StatusBar hidden />
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle={"Permission to use camera"}
          permissionDialogMessage={
            "We need your permission to use your camera phone"
          }
          captureAudio={false}
        >
          {({ camera, status }) => {
            if (status !== "READY") return <PendingView />;
            return (
              <View
                style={{
                  flex: 0,
                  flexDirection: "row",
                  justifyContent: "center",
                  margin: 15
                }}
              >
                <Button
                  onPress={() => this.takePicture(camera)}
                  icon
                  transparent
                >
                  <Icon
                    style={{ fontSize: 40, color: "#fff" }}
                    name="camera"
                    type="FontAwesome5"
                  />
                </Button>
              </View>
            );
          }}
        </RNCamera>
      </Container>
    );
  }

  takePicture = async function(camera) {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    //  eslint-disable-next-line
    console.log(data.uri);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
});
