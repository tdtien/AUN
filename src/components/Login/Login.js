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
  Header
} from "native-base";
import { StyleSheet, Image } from "react-native";
import {Actions} from 'react-native-router-flux'

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Header androidStatusBarColor="#fff" style={{backgroundColor:"#fff"}}/>
        <Content>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../../assets/images/logo.jpg")}
            />
            <Text style={styles.title}>Food Delivery Now</Text>
          </View>
          <Form>
            <Item stackedLabel>
              <Label>Username</Label>
              <Input />
            </Item>
            <Item stackedLabel last>
              <Label>Password</Label>
              <Input />
            </Item>
            <ListItem noBorder>
              <Body>
                <Button info block>
                  <Text>Sign In</Text>
                </Button>
                <Button info block style={styles.button} onPress = {() => Actions.register()}>
                  <Text>Register</Text>
                </Button>
              </Body>
            </ListItem>
          </Form>
        </Content>
      </Container>
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
    color: "#FFF",
    marginTop: 10,
    fontSize: 20,
    textAlign: "center",
    opacity: 0.9
  },
  button: {
    marginTop: 15
  }
});
