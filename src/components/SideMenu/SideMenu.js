import React, { Component } from "react";
import { StyleSheet, ImageBackground, Image, Platform } from "react-native";
import { Container, Content, List, ListItem, Footer, FooterTab, Button, Icon, Text, Left, Body, Right, Thumbnail, } from "native-base";
import Images from "../../assets/images";
import { AppCommon } from "../../commons/commons";
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux'
import { logoutAccount } from "../../actions/account";
import I18n from "../../i18n/i18n";
import keys from "../../i18n/keys";

class SideMenu extends Component {
    constructor(props) {
        super(props);
    };

    handleLogout = () => {
        this.props.logout();
    }

    render() {
        const { email, language } = this.props;
        return (
            <Container>
                <Content style={{ paddingTop: Platform.OS === 'ios' ? 20 : 0 }}>
                    <ImageBackground
                        source={Images.logo}
                        style={{
                            height: 120,
                            alignSelf: "stretch",
                            justifyContent: "center",
                            alignItems: "center",
                            resizeMode: 'contain'
                        }}
                    >
                    </ImageBackground>
                    <List>
                        <ListItem avatar>
                            <Left>
                                <Thumbnail source={Images.defaultUser} small />
                            </Left>
                            <Body>
                                <Text>{email}</Text>
                            </Body>
                        </ListItem>
                        <ListItem button onPress={() => Actions.currentScene == '_sarExplorer' ? Actions.drawerClose() : Actions.replace('_sarExplorer')} icon >
                            <Left>
                                <Icon name={AppCommon.icon("tv")} style={{ color: 'gray', fontSize: AppCommon.icon_size }} />
                            </Left>
                            <Body>
                                <Text>{I18n.t(keys.SideMenu.Main.lblSarEditor)}</Text>
                            </Body>
                        </ListItem>
                        <ListItem button onPress={() => Actions.currentScene == '_sarViewer' ? Actions.drawerClose() : Actions.replace('_sarViewer')} icon  >
                            <Left>
                                <Icon name={AppCommon.icon("book")} style={{ color: 'gray', fontSize: AppCommon.icon_size }} />
                            </Left>
                            <Body>
                                <Text>{I18n.t(keys.SideMenu.Main.lblSarViewer)}</Text>
                            </Body>
                        </ListItem>
                        <ListItem button onPress={() => Actions.currentScene == '_setting' ? Actions.drawerClose() : Actions.replace('_setting')} icon>
                            <Left>
                                <Icon name={AppCommon.icon("settings")} style={{ color: 'gray', fontSize: AppCommon.icon_size }} />
                            </Left>
                            <Body>
                                <Text>{I18n.t(keys.SideMenu.Main.btnSetting)}</Text>
                            </Body>
                        </ListItem>
                    </List>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button
                            full
                            style={{ backgroundColor: AppCommon.colors }}
                            onPress={() => this.handleLogout()}
                        >
                            <Icon name={AppCommon.icon("log-out")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                            <Text style={{ color: "#fff" }}>{I18n.t(keys.SideMenu.Main.btnLogout)}</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container >
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
            dispatch(logoutAccount());
        },
    };
};

const mapStateToProps = state => {
    return {
        email: state.account.email,
        admin: state.account.admin,
        token: state.account.token,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);