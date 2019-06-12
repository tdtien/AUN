import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Container, Header, Content, Title, Button, Icon, Text, Body, Segment, View } from "native-base";
import { AppCommon } from "../../commons/commons";
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux'
import { changeLanguage } from "../../actions/settingAction";
import I18n from "../../i18n/i18n";
import keys from "../../i18n/keys";

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            segmentIndex: this.props.language === 'en' ? 0 : 1,
        }
    };

    handleLogout = () => {
        this.props.logout();
    }

    toggleSegment = (index) => {
        if (index !== this.state.segmentIndex) {
            this.setState({
                segmentIndex: index
            }, () => {
                this.props.changeLanguage({ language: index === 0 ? 'en' : 'vi' });
                AppCommon.sarCache.clearAll(function (err) {
                });
            })
        }
    }

    render() {
        const { segmentIndex } = this.state;
        const { language } = this.props;
        return (
            <Container>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                    hasTabs
                >
                    <TouchableOpacity style={styles.headerButton} onPress={() => Actions.drawerOpen()} >
                        <Icon name={AppCommon.icon("menu")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center", color: "white" }}> {I18n.t(keys.SideMenu.Setting.lblTitle)}</Title>
                    </Body>
                </Header>
                <Content>
                    <View style={{ marginHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#e6e6e6', marginTop: 10 }}>
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
                                <Text style={{ color: segmentIndex === 0 ? 'white' : '#a6a6a6' }}>English</Text>
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
                                <Text style={{ color: segmentIndex === 1 ? 'white' : '#a6a6a6' }}>Tiếng Việt</Text>
                            </Button>
                        </Segment>
                    </View>
                </Content>
            </Container>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeLanguage: item => {
            dispatch(changeLanguage(item));
        }
    };
};

const mapStateToProps = state => {
    return {
        language: state.setting.language,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Setting);

const styles = StyleSheet.create({
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 10
    }
});