import React, { Component } from "react";
import { StyleSheet, ImageBackground, Image } from "react-native";
import { Container, Content, List, ListItem, Footer, FooterTab, Button, Icon, Text, Left, Body, Right, Thumbnail } from "native-base";
import Images from "../../assets/images";
import { AppCommon } from "../../commons/commons";
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux'
import { logoutAccount } from "../../actions/account";


class SideMenu extends Component {
    constructor(props) {
        super(props);
    };

    handleLogout = () => {
        // alert('This function is not supported yet');
        this.props.logout();
    }

    render() {
        return (
            <Container>
                <Content>
                    <ImageBackground
                        source={Images.logo}
                        style={{
                            height: 120,
                            alignSelf: "stretch",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                    </ImageBackground>
                    <List>
                        <ListItem avatar>
                            <Left>
                                <Thumbnail source={Images.defaultUser} small />
                            </Left>
                            <Body>
                                <Text>{this.props.email}</Text>
                                <Text note>{this.props.role}</Text>
                            </Body>
                        </ListItem>
                        <ListItem button onPress={() => Actions.currentScene == '_merchant' ? Actions.drawerClose() : Actions.merchant()} icon noBorder >
                            <Left>
                                <Icon name={AppCommon.icon("document")} style={{ color: 'gray', fontSize: AppCommon.icon_size }} />
                            </Left>
                            <Body>
                                <Text>All Docs</Text>
                            </Body>
                        </ListItem>
                        <ListItem button onPress={() => Actions.currentScene == '_sarViewer' ? Actions.drawerClose() : Actions.sarViewer()} icon noBorder >
                            <Left>
                                <Icon name={AppCommon.icon("tv")} style={{ color: 'gray', fontSize: AppCommon.icon_size }} />
                            </Left>
                            <Body>
                                <Text>SAR Viewer</Text>
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
                            <Text style={{ color: "#fff" }}>Log out</Text>
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
        }
    };
};

const mapStateToProps = state => {
    return {
        email: state.account.email,
        role: state.account.role,
        token: state.account.token
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);