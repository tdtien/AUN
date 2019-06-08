import React, { Component } from 'react';
import { Router, Stack, Scene, Drawer, Actions } from 'react-native-router-flux';
import Login from './src/components/Login/Login';
import Register from './src/components/Register/Register'
import ImageModal from './src/components/ImageModal/ImageModal';
import Merchant from './src/components/Merchant/Merchant';
import MerchantDetail from './src/components/Merchant/MerchantDetail';
import SideMenu from './src/components/SideMenu/SideMenu';
import PDFViewer from './src/components/PDFViewer/PDFViewer';
import { connect } from "react-redux";
import { ToastAndroid, BackHandler, Alert, View, StyleSheet, Image } from "react-native";
import SortList from './src/components/Merchant/SortList';
import { Root } from 'native-base';
import { checkToken } from './src/api/accountApi';
import { logoutAccount } from './src/actions/account';
import SarExplorer from './src/components/SarViewer/SarExplorer';
import Comment from './src/components/Comment/Comment';
import Images from './src/assets/images';
import TextViewer from './src/components/TextViewer/TextViewer';
import SarViewer from './src/components/SarViewer/SarViewer';
import I18n from './src/i18n/i18n';
import Setting from './src/components/Setting/Setting';

class App extends Component {

  constructor(props) {
    super(props);
    I18n.locale = this.props.language;
    this.state = {
      isSplashScreenVisible: true
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({ isSplashScreenVisible: false }, () => {
      if (Actions.currentScene !== 'login') {
        checkToken(this.props.token).then(response => {
          if (response.hasOwnProperty('expire_time')) {
            if (response.expire_time) {
              Alert.alert(
                'Error!',
                response.msg,
                [
                  { text: 'OK', onPress: () => this.props.logout() }
                ]
              );
            }
          }
        }).catch(error => {
          console.log(error);
        })
      }
    }), 2500);
  }

  render() {
    var backLoginScene = false;
    let exitScene = ["login", "_merchant", "_sarExplorer"];
    if (this.state.isSplashScreenVisible) {
      return (
        <View style={styles.splashScreenView}>
          <Image source={Images.logo} resizeMode="contain" style={styles.splashImage} />
        </View>
      )
    }
    return (
      <Root>
        <Router
          backAndroidHandler={() => {
            if (exitScene.includes(Actions.currentScene)) {
              if (backLoginScene == false) {
                ToastAndroid.show("Click back again to exit.", ToastAndroid.SHORT);
                backLoginScene = !backLoginScene;
                setTimeout(function () {
                  backLoginScene = !backLoginScene;
                }, 2000);
                return true;
              } else {
                backLoginScene = false;
                BackHandler.exitApp();
              }
              return false;
            }
          }}
        >
          <Stack key="root" hideNavBar>
            <Scene
              key="login"
              component={Login}
              initial={!this.props.isLoggedIn}
            />
            <Scene
              key="register"
              component={Register}
              title="Register"
            />
            <Scene
              key="imageModal"
              component={ImageModal}
            />
            <Scene
              key="sortList"
              component={SortList}
            />
            <Drawer
              hideNavBar
              key="drawerMenu"
              contentComponent={SideMenu}
              drawerWidth={300}
              initial={this.props.isLoggedIn}
            >
              <Scene
                hideNavBar
                key="sarExplorer"
                component={SarExplorer}
              />
              <Scene
                hideNavBar
                key="sarViewer"
                component={SarViewer}
              />
              <Scene
                key="setting"
                hideNavBar
                component={Setting}
              />
            </Drawer>
            <Scene
              hideNavBar
              key="merchant"
              component={Merchant}
            />
            <Scene
              key="merchantDetail"
              component={MerchantDetail}
            />
            <Scene
              key="pdfViewer"
              component={PDFViewer}
            />
            <Scene
              key="textViewer"
              component={TextViewer}
            />
            <Scene
              key="comment"
              component={Comment}
            />
          </Stack>
        </Router>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
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
    width: 250,
    height: 250
  },
})

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(logoutAccount());
    }
  };
};

const mapStateToProps = state => {
  return {
    id: state.account.id,
    token: state.account.token,
    isLoggedIn: state.account.isLoggedIn,
    language: state.setting.language
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);