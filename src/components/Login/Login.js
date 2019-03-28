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
import { requestLogin } from "../../api/accountApi";
import { connect } from "react-redux";
import { loginAccount } from "../../actions/account";
import Loader from "../Loader/Loader";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false,
      isSplashScreenVisible: true,
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
      requestLogin(this.state.email, this.state.password).then(res => {
        this.setState({ isLoading: false });
        if (res.hasOwnProperty('token')) {
          this.props.login({ id: res.id, token: res.token });
          Actions.merchant();
        } else {
          Toast.show({
            text: res.msg,
            type: "danger",
            buttonText: "Okay"
          });
        }
      }).catch(error => {
        this.setState({ isLoading: false });
        console.log(error);
      })
    }
  };

  hideSplashScreen = () => {
    this.setState({
      isSplashScreenVisible: false,
    })
  };

  componentDidMount() {
    var that = this;
    setTimeout(function () {
      that.hideSplashScreen();
    }, 2500);
  }

  render() {
    let splashScreen = (
      <View style={styles.splashScreenView}>
        <Image style={styles.splashImage} source={Images.logo} />
      </View>
    )
    return (
      <Root>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <Container>
          <Content>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} source={Images.logo} />
              <Text style={styles.title}>AUN Inspection System</Text>
            </View>
            <Form>
              <Item floatingLabel>
                <Label>Email</Label>
                <Input
                  keyboardType="email-address"
                  onChangeText={email => this.setState({ email: email })}
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
                  onChangeText={password => this.setState({ password: password })}
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
          </Content>
          <View style={styles.registerContainer}>
            <Text style={{ fontSize: 15 }}>Don't have account yet?</Text>
            <Button transparent info onPress={() => Actions.register()}>
              <Text style={{ fontSize: 13 }}>Register now!</Text>
            </Button>
          </View>
          {
            (this.state.isSplashScreenVisible === true) ? splashScreen : null
          }
          <Loader loading={this.state.isLoading} />
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
  },
  splashScreenView: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 0,
    width: '100%',
    height: '100%'
  },
  splashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

const mapDispatchToProps = dispatch => {
  return {
    login: item => {
      dispatch(loginAccount(item));
    }
  };
};

const mapStateToProps = state => {
  return {
    id: state.account.id,
    token: state.account.token,
    isLoggedIn: state.account.isLoggedIn
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
