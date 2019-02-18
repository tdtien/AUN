import React, {Component} from 'react';
import { Router, Stack, Scene } from 'react-native-router-flux';
import Login from './src/components/Login/Login';
import Register from './src/components/Register/Register'
import Camera from './src/components/Camera/Camera';

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
        </Stack>
      </Router>
    );
  }
}
