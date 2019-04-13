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
import { BackHandler } from "react-native";
import { ToastAndroid } from "react-native";
import SortList from './src/components/Merchant/SortList';
import Folder from './src/components/FolderExplorer/FolderItem';
import File from './src/components/FolderExplorer/File';
import Evidences from './src/components/FolderExplorer/Evidences';
import FolderComponent from './src/components/FolderExplorer/FolderItem';
import SarViewer from './src/components/FolderExplorer/SarViewer';
import CriterionViewer from './src/components/FolderExplorer/CriterionViewer';
import Test from './src/components/FolderExplorer/Test';
import SubCriterionViewer from './src/components/FolderExplorer/SubCriterionViewer';
import SuggestionViewer from './src/components/FolderExplorer/SuggestionViewer';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    var backLoginScene = false;
    return (
      <Router
        backAndroidHandler={() => {
          if (Actions.currentScene == "login" || Actions.currentScene == "_merchant") {
            if (backLoginScene == false) {
              ToastAndroid.show("Click back again to exit.", ToastAndroid.SHORT);
              backLoginScene = !backLoginScene;
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
              key="merchant"
              component={Merchant}
            />
          </Drawer>
          <Scene
            key="merchantDetail"
            component={MerchantDetail}
          />
          <Scene
            key="pdfViewer"
            component={PDFViewer}
          />
          <Scene
            key="file"
            component={File}
          />
          <Scene
            key="evidences"
            component={Evidences}
          />
          <Scene
            key="sarViewer"
            component={SarViewer}
            // initial
          />
          <Scene
            key="criterionViewer"
            component={CriterionViewer}
          />
          <Scene
            key="subCriterionViewer"
            component={SubCriterionViewer}
          />
           <Scene
            key="suggestionViewer"
            component={SuggestionViewer}
          />
          <Scene
            key="test"
            component={Test}
          />
        </Stack>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    id: state.account.id,
    token: state.account.token,
    isLoggedIn: state.account.isLoggedIn
  };
};

export default connect(mapStateToProps)(App);