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
  Header,
  Icon
} from "native-base";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import Images from "../../assets/images";
import { requestLogin } from "../../api/accountApi";
import { connect } from "react-redux";
import { loginAccount } from "../../actions/account";
import Loader from "../Loader/Loader";
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';
import { AppCommon } from "../../commons/commons";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isLoading: false,
      isHidden: true
    };

    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnMount() {
    this.mounted = false
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
        this.mounted && this.setState({ isLoading: false });
        if (res.hasOwnProperty('token')) {
          this.props.login({ id: res.id, token: res.token, email: res.email, admin: res.admin });
          if (this.props.isFirstTime) {
            Actions.welcome();
          } else {
            Actions.drawerMenu();
          }
        } else {
          Toast.show({
            text: res.msg,
            type: "danger",
            buttonText: I18n.t(keys.Common.lblOK)
          });
        }
      }).catch(error => {
        this.mounted && this.setState({ isLoading: false });
        console.log(error);
      })
    }
  };

  render() {
    return (
      <Container>
        <Header noShadow iosBarStyle="dark-content" style={{ backgroundColor: 'white', border: 0, borderBottomWidth: 0 }} androidStatusBarColor="white" />
        <Content>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={Images.logo} />
            <Text style={styles.title}>{I18n.t(keys.Login.lblTitle)}</Text>
          </View>
          <Form style={styles.formContainer}>
            <Item style={styles.inputStyle}>
              <Label>{I18n.t(keys.Login.lblEmail)}</Label>
              <Input
                keyboardType="email-address"
                onChangeText={email => this.setState({ email: email })}
                onSubmitEditing={() => this.passwordInput._root.focus()}
                returnKeyType="next"
                autoCapitalize="none"
              />
            </Item>
            <Item style={styles.inputStyle}>
              <Label>{I18n.t(keys.Login.lblPassword)}</Label>
              <Input
                autoCapitalize="none"
                secureTextEntry={this.state.isHidden}
                style={{ fontSize: 16 }}
                onChangeText={password => this.setState({ password: password })}
                ref={input => (this.passwordInput = input)}
                returnKeyType="go"
                onSubmitEditing={() => this.handleLogin()}
              />
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({ isHidden: !this.state.isHidden })}>
                <Icon style={{ fontSize: 16, color: 'grey' }} name={AppCommon.icon(this.state.isHidden ? 'eye' : 'eye-off')} />
              </TouchableOpacity>
            </Item>
          </Form>
          <ListItem noBorder style={{maxWidth: 600, alignSelf: 'center'}}>
            <Body>
              <Button block info onPress={() => this.handleLogin()}>
                <Text>{I18n.t(keys.Login.btnSignIn)}</Text>
              </Button>
            </Body>
          </ListItem>
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
    width: 150,
    height: 100,
    resizeMode: 'contain'
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
    maxWidth: 600,
    marginHorizontal: 15
  },
  formContainer: {
    alignItems: 'center'
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
    isFirstTime: state.account.isFirstTime
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
