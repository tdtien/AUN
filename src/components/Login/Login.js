import React, { Component } from "react";
import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Button,
  Text,
  ListItem,
  Body,
  View,
  Toast,
  Root,
  Spinner
} from "native-base";
import { StyleSheet, Image, StatusBar } from "react-native";
import { Actions } from "react-native-router-flux";
import Images from "../../assets/images";
import { validateEmail } from "../../commons/validation";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false
    };
  }

  handleLogin = () => {
    this.setState({ isLoading: true });
    if (this.state.email === "") {
      this.setState({ isLoading: false });
      Toast.show({
        text: "Please enter your email address",
        type: "warning",
        buttonText: "Okay"
      });
    } else if (this.state.password === "") {
      this.setState({ isLoading: false });
      Toast.show({
        text: "Please enter your password",
        type: "warning",
        buttonText: "Okay"
      });
    } else {
      this.setState({ isLoading: false });
      if (!validateEmail(this.state.email)) {
        Toast.show({
          text: "Your email address is incorrect",
          type: "danger",
          buttonText: "Okay"
        });
      } else {
        Toast.show({
          text: "Login successful",
          type: "success",
          buttonText: "Okay"
        });
        Actions.camera();
      }
    }
  };

  validate = text => {
    this.setState({ email: text });
    if (!validateEmail(this.state.email)) {
      Toast.show({
        text: "Your email address is incorrect",
        type: "danger",
        buttonText: "Okay"
      });
    } else {
      Toast.show({
        text: "Your email address is correct",
        type: "success",
        buttonText: "Okay"
      });
    }
  };

  render() {
    return (
      <Root>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content"/>
        <Container>
          <Content>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} source={Images.logo} />
              <Text style={styles.title}>AUN Inspection System</Text>
            </View>
            {this.state.isLoading ? (
              <Spinner />
            ) : (
              <Form>
                <Item floatingLabel>
                  <Label>Email</Label>
                  <Input
                    keyboardType="email-address"
                    onChangeText={email => this.validate(email)}
                    onSubmitEditing={() => this.passwordInput._root.focus()}
                    returnKeyType="next"
                    autoCapitalize="none"
                  />
                </Item>
                <Item floatingLabel last>
                  <Label>Password</Label>
                  <Input
                    autoCapitalize="none"
                    secureTextEntry
                    onChangeText={password =>
                      this.setState({ password: password })
                    }
                    getRef={input => (this.passwordInput = input)}
                    returnKeyType="go"
                    onSubmitEditing={() => this.handleLogin()}
                  />
                </Item>
                <ListItem noBorder>
                  <Body>
                    <Button info block onPress={() => this.handleLogin()}>
                      <Text>Sign In</Text>
                    </Button>
                  </Body>
                </ListItem>
              </Form>
            )}
          </Content>
          <View style={styles.registerContainer}>
            <Text style={{ fontSize: 15 }}>Don't have account yet?</Text>
            <Button transparent info onPress={() => Actions.register()}>
              <Text style={{ fontSize: 13 }}>Register now!</Text>
            </Button>
          </View>
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  logoContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: 125,
    height: 100
  },
  title: {
    color: "#424242",
    marginTop: 10,
    fontSize: 20,
    textAlign: "center",
    opacity: 0.9
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});
