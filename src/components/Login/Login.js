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
  Header
} from "native-base";
import { StyleSheet, Image } from "react-native";
import { Actions } from "react-native-router-flux";
import Images from "../../assets/images";
import { requestLogin } from "../../api/accountApi";
import { connect } from "react-redux";
import { loginAccount } from "../../actions/account";
import Loader from "../Loader/Loader";
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false,
    };
  }

  handleLogin = () => {
    this.setState({ isLoading: true });
    if (this.state.email === "") {
      this.setState({ isLoading: false });
      Toast.show({
        text: I18n.t(keys.Login.toastEmptyEmail),
        type: "warning",
        buttonText: I18n.t(keys.Common.lblOK)
      });
    } else if (this.state.password === "") {
      this.setState({ isLoading: false });
      Toast.show({
        text: I18n.t(keys.Login.toastEmptyPassword),
        type: "warning",
        buttonText: I18n.t(keys.Common.lblOK)
      });
    } else {
      requestLogin(this.state.email, this.state.password).then(res => {
        this.setState({ isLoading: false });
        if (res.hasOwnProperty('token')) {
          this.props.login({ id: res.id, token: res.token, email: res.email, admin: res.admin });
          Actions.sarExplorer();
        } else {
          Toast.show({
            text: res.msg,
            type: "danger",
            buttonText: I18n.t(keys.Common.lblOK)
          });
        }
      }).catch(error => {
        this.setState({ isLoading: false });
        console.log(error);
      })
    }
  };
  
  render() {
    return (
      <Container>
        <Header noShadow iosBarStyle="dark-content" style={{ backgroundColor: 'white', border: 0, borderBottomWidth: 0 }} androidStatusBarColor="white"/>
        <Content>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={Images.logo} />
            <Text style={styles.title}>{I18n.t(keys.Login.lblTitle)}</Text>
          </View>
          <Form>
            <Item floatingLabel style={styles.inputStyle}>
              <Label>{I18n.t(keys.Login.lblEmail)}</Label>
              <Input
                keyboardType="email-address"
                onChangeText={email => this.setState({ email: email })}
                onSubmitEditing={() => this.passwordInput._root.focus()}
                returnKeyType="next"
                autoCapitalize="none"
              />
            </Item>
            <Item floatingLabel style={styles.inputStyle}>
              <Label>{I18n.t(keys.Login.lblPassword)}</Label>
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
                  <Text>{I18n.t(keys.Login.btnSignIn)}</Text>
                </Button>
              </Body>
            </ListItem>
          </Form>
        </Content>
        {/* <View style={styles.registerContainer}>
          <Text style={{ fontSize: 15 }}>Don't have account yet?</Text>
          <Button transparent info onPress={() => Actions.register()}>
            <Text style={{ fontSize: 13 }}>Register now!</Text>
          </Button>
        </View> */}
        <Loader loading={this.state.isLoading} />
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
  inputStyle: {
    marginRight: 15 ,
  }
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
