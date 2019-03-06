import React, {Component} from 'react';
import { Router, Stack, Scene } from 'react-native-router-flux';
import Login from './src/components/Login/Login';
import Register from './src/components/Register/Register'
import Camera from './src/components/Camera/Camera';
import ImageModal from './src/components/ImageModal/ImageModal';
import Merchant from './src/components/Merchant/Merchant';
import MerchantDetail from './src/components/Merchant/MerchantDetail';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Stack key="root" hideNavBar>
          <Scene
            key="login"
            component={Login}
            initial
          />
          <Scene
              key="register"
              component={Register}
              title = "Register"
          />
          <Scene
            key="camera"
            component={Camera}
          />
          <Scene
            key="imageModal"
            component={ImageModal}
          />
          <Scene 
            key="merchant"
            component={Merchant}
          />
          <Scene
            key="merchantDetail"
            component={MerchantDetail}
          />
        </Stack>
      </Router>
    );
  }
}
