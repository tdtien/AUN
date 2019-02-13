import React, {Component} from 'react';
import { Router, Stack, Scene } from 'react-native-router-flux';
import Login from './src/components/Login/Login';

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
        </Stack>
      </Router>
    );
  }
}
