import React, { Component } from 'react';
import { Router, Stack, Scene, Drawer } from 'react-native-router-flux';
import Login from './src/components/Login/Login';
import Register from './src/components/Register/Register'
import Camera from './src/components/Camera/Camera';
import ImageModal from './src/components/ImageModal/ImageModal';
import Merchant from './src/components/Merchant/Merchant';
import MerchantDetail from './src/components/Merchant/MerchantDetail';
import SideMenu from './src/components/SideMenu/SideMenu';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Stack key="root" hideNavBar>
          <Scene
            key="login"
            component={Login}
          />
          <Scene
            key="register"
            component={Register}
            title="Register"
          />
          <Scene
            key="camera"
            component={Camera}
          />
          <Scene
            key="imageModal"
            component={ImageModal}
          />

          <Drawer
            hideNavBar
            key="drawerMenu"
            contentComponent={SideMenu}
            drawerWidth={300}
            initial
          >
            <Scene
              hideNavBar
              key="merchant"
              component={Merchant}
            /> 
          </Drawer>
          <Scene
              key="merchantDetail"
              component={MerchantDetail}
            />
        </Stack>
      </Router>
    );
  }
}
