/** @format */

import { AppRegistry } from "react-native";
import React from "react";
import App from "./App";
import { name as appName } from "./app.json";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/lib/integration/react';
import { MenuProvider } from 'react-native-popup-menu';

import { persistor, store } from "./store";

const Application = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <MenuProvider>
        <App />
      </MenuProvider>
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => Application);
