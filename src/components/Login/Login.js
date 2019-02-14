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
  Footer,
  Spinner
} from "native-base";
import { StyleSheet, Image } from "react-native";
import { Actions } from "react-native-router-flux";
import Images from "../../assets/images";

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
      this.setState({isLoading: false})
      Toast.show({
        text: "Please enter your email address",
        type: "warning",
        buttonText: "Okay"
      });
    } else if (this.state.password === "") {
      this.setState({isLoading: false})
      Toast.show({
        text: "Please enter your password",
        type: "warning",
        buttonText: "Okay"
      });
    } else {
      this.setState({isLoading: false})
      Toast.show({
        text: "Login successful",
        type: "success",
        buttonText: "Okay"
      });
    }
  };

  render() {
    return (
      <Root>
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
                <Item stackedLabel>
                  <Label>Email</Label>
                  <Input
                    keyboardType="email-address"
                    onChangeText={email => this.setState({ email: email })}
                    onSubmitEditing={() =>
                      this.refs["passwordInput"]._root.focus()
                    }
                    returnKeyType="next"
                    autoCapitalize="none"
                  />
                </Item>
                <Item stackedLabel last>
                  <Label>Password</Label>
                  <Input
                    autoCapitalize="none"
                    secureTextEntry
                    onChangeText={password =>
                      this.setState({ password: password })
                    }
                    ref="passwordInput"
                    returnKeyType="go"
                    clearButtonMode="unless-editing"
                  />
                </Item>
                <ListItem noBorder>
                  <Body>
                    <Button info block onPress={() => this.handleLogin()}>
                      <Text>Sign In</Text>
                    </Button>
                  </Body>
                </ListItem>
                <ListItem noBorder>
                  <Body>
                    <Button info block onPress={() => Actions.register()}>
                      <Text>Register</Text>
                    </Button>
                  </Body>
                </ListItem>
              </Form>
            )}
          </Content>
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
  button: {
    marginTop: 15
  }
});
