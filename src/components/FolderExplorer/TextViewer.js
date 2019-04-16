import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Alert,
    ScrollView
} from 'react-native';
import {
    Content,
    Container,
    Icon,
    Header,
    Body,
    Title,
} from 'native-base';
import { AppCommon } from '../../commons/commons';
import { Actions } from 'react-native-router-flux';
import moment from 'moment'
import EvidenceItem from "./EvidenceItem";

export default class TextViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
        };
    }

    renderItem(item) {
        return (
            <EvidenceItem
                item={item}
                itemId={this.props.itemId}
            />
        )
    }

    render() {
        return (
            <Container style={{ backgroundColor: 'white' }}>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                    rounded
                >
                    <TouchableOpacity style={styles.menuButton} onPress={() => Actions.pop()} >
                        <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center", color: 'white' }}>Implication</Title>
                    </Body>
                    <TouchableOpacity style={styles.menuButton} onPress={() => null} >
                        <Icon name={AppCommon.icon("more")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                </Header>
                <Content
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                >
                    <Text style={styles.text} >{this.props.data}</Text>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    text: {
        paddingHorizontal: 20,
        paddingTop: 30,
        fontSize: 21,
        textAlign: 'justify',
        color: '#404040'
        // fontWeight: '100',
        // letterSpacing: 20
    }
});