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
import SuggestionTypeViewer from './src/components/FolderExplorer/SuggestionTypeViewer';
import FolderComponent from './src/components/FolderExplorer/FolderItem';
import SarViewer from './src/components/FolderExplorer/SarViewer';
import CriterionViewer from './src/components/FolderExplorer/CriterionViewer';
import SubCriterionViewer from './src/components/FolderExplorer/SubCriterionViewer';
import SuggestionViewer from './src/components/FolderExplorer/SuggestionViewer';
import TextViewer from './src/components/FolderExplorer/TextViewer';
import EvidenceViewer from './src/components/FolderExplorer/EvidenceViewer';
import { Root } from 'native-base';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    var backLoginScene = false;
    let exitScene = ["login", "_merchant", "_sarViewer"];
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
                key="sarViewer"
                component={SarViewer}
              />
            </Drawer>
            <Scene
              hideNavBar
              key="merchant"
              component={Merchant}
              // initial
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
              key="suggestionTypeViewer"
              component={SuggestionTypeViewer}
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
            // initial
            />
            <Scene
              key="textViewer"
              component={TextViewer}
            />
            <Scene
              key="evidenceViewer"
              component={EvidenceViewer}
            // initial
            />
          </Stack>
        </Router>
      </Root>
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