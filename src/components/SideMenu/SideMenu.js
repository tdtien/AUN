import React, { Component } from "react";
import { StyleSheet, ImageBackground, Image } from "react-native";
import { Container, Content, List, ListItem, Footer, FooterTab, Button, Icon, Text, Left, Body, Right, Thumbnail, Segment, View } from "native-base";
import Images from "../../assets/images";
import { AppCommon } from "../../commons/commons";
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux'
import { logoutAccount } from "../../actions/account";
import { changeLanguage } from "../../actions/settingAction";
import I18n from "../../i18n/i18n";
import keys from "../../i18n/keys";

class SideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settingView: false,
            segmentIndex: this.props.language === 'en' ? 0 : 1,
        }
    };

    handleLogout = () => {
        this.props.logout();
    }

    toggleSetting = () => {
        this.setState({
            settingView: !this.state.settingView
        })
    }

    toggleSegment = (index) => {
        this.setState({
            segmentIndex: index
        }, () => {
            this.props.changeLanguage({ language: index === 0 ? 'en' : 'vi' })
        })
    }

    render() {
        const { settingView, segmentIndex } = this.state;
        const { email, language } = this.props;
        return (
            <Container>
                {!settingView ? (
                    <Content>
                        <ImageBackground
                            source={Images.logo}
                            style={{
                                height: 120,
                                alignSelf: "stretch",
                                justifyContent: "center",
                                alignItems: "center",
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
                            <ListItem button onPress={() => Actions.currentScene == '_sarExplorer' ? Actions.drawerClose() : Actions.sarExplorer()} icon noBorder >
                                <Left>
                                    <Icon name={AppCommon.icon("tv")} style={{ color: 'gray', fontSize: AppCommon.icon_size }} />
                                </Left>
                                <Body>
                                    <Text>SAR Explorer</Text>
                                </Body>
                            </ListItem>
                            <ListItem button onPress={() => Actions.currentScene == '_sarViewer' ? Actions.drawerClose() : Actions.sarViewer()} icon  >
                                <Left>
                                    <Icon name={AppCommon.icon("book")} style={{ color: 'gray', fontSize: AppCommon.icon_size }} />
                                </Left>
                                <Body>
                                    <Text>SAR Viewer</Text>
                                </Body>
                            </ListItem>
                            <ListItem button onPress={() => this.toggleSetting()} icon >
                                <Left>
                                    <Icon name={AppCommon.icon("settings")} style={{ color: 'gray', fontSize: AppCommon.icon_size }} />
                                </Left>
                                <Body>
                                    <Text>{I18n.t(keys.SideMenu.Main.btnSetting)}</Text>
                                </Body>
                            </ListItem>
                        </List>
                    </Content>
                ) : (
                        <Content>
                            <Button
                                transparent
                                dark
                                onPress={() => this.toggleSetting()}
                            >
                                <Icon name={AppCommon.icon("arrow-back")} style={{ color: AppCommon.colors, fontSize: AppCommon.icon_size }} />
                            </Button>
                            <Text style={{ textAlign: 'center', fontSize: 23, fontWeight: 'bold', marginBottom: 5 }}>
                                {I18n.t(keys.SideMenu.Setting.lblTitle)}
                            </Text>
                            <View style={{ marginHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e6e6e6', marginTop: 10 }}>
                                <Text style={{ fontSize: AppCommon.font_size, fontWeight: 'bold' }}>
                                    {I18n.t(keys.SideMenu.Setting.lblLanguage)}
                                </Text>
                                <Segment style={{ backgroundColor: 'white', borderRadius: 10 }} >
                                    <Button
                                        first
                                        style={{
                                            backgroundColor: segmentIndex === 0 ? AppCommon.colors : undefined,
                                            borderColor: AppCommon.colors,
                                            borderTopLeftRadius: 5,
                                            borderBottomLeftRadius: 5,
                                        }}
                                        active={segmentIndex === 0 ? true : false}
                                        onPress={() => this.toggleSegment(0)}
                                    >
                                        <Text style={{ color: segmentIndex === 0 ? 'white' : '#999999' }}>English</Text>
                                    </Button>
                                    <Button
                                        style={{
                                            backgroundColor: segmentIndex === 1 ? AppCommon.colors : undefined,
                                            borderColor: AppCommon.colors,
                                            borderTopRightRadius: 5,
                                            borderBottomRightRadius: 5,
                                        }}
                                        active={segmentIndex === 1 ? true : false}
                                        onPress={() => this.toggleSegment(1)}
                                    >
                                        <Text style={{ color: segmentIndex === 1 ? 'white' : '#999999' }}>Tiếng Việt</Text>
                                    </Button>
                                </Segment>
                            </View>
                        </Content>

                    )}
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
            </Container>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
            dispatch(logoutAccount());
        },
        changeLanguage: item => {
            dispatch(changeLanguage(item));
        }
    };
};

const mapStateToProps = state => {
    return {
        email: state.account.email,
        admin: state.account.admin,
        token: state.account.token,
        language: state.setting.language,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);