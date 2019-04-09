import React, { Component } from "react";
import { StyleSheet, ImageBackground, Image } from "react-native";
import { Container, Content, List, ListItem, Footer, FooterTab, Button, Icon, Text } from "native-base";
import Images from "../../assets/images";
import { AppCommon } from "../../commons/commons";
import { Actions } from "react-native-router-flux";


export default class SideMenu extends Component {
    constructor(props) {
        super(props);
    };

    handleLogout = () => {
        alert('This function is not supported yet');
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
                        {/* <Image
                            square
                            style={{ height: 80, width: 70 }}
                            source={Images.defaultUser}
                        />
                        <Text style={{ color: "gray" }}>Default User</Text> */}
                    </ImageBackground>
                    <List>
                        <ListItem button onPress={() => Actions.drawerClose()}>
                            <Text>Home</Text>
                        </ListItem>
                    </List>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button
                            full
                            style={{ backgroundColor: "#2196F3" }}
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