import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    View
} from 'react-native';
import {
    Content,
    Container,
    Icon,
    Header,
    Body,
    Title,
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { AppCommon } from '../../commons/commons';

export default class TextViewer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { title, hasHeader, data } = this.props;
        let titleHeader = title.charAt(0).toUpperCase() + title.slice(1, title.length);
        return (
            <Container style={{ backgroundColor: 'white' }}>
                {hasHeader ? (
                    <Header
                        androidStatusBarColor={AppCommon.colors}
                        iosBarStyle="light-content"
                        style={{ backgroundColor: AppCommon.colors }}
                        rounded
                    >
                        <TouchableOpacity style={styles.menuButton} onPress={() => Actions.pop()} >
                            <Icon name={AppCommon.icon("arrow-back")} style={styles.icon} />
                        </TouchableOpacity>
                        <Body style={{ flex: 1 }}>
                            <Title style={styles.title}>{titleHeader}</Title>
                        </Body>
                        <TouchableOpacity style={styles.menuButton} onPress={() => null} >
                            <Icon name={AppCommon.icon("more")} style={styles.icon} />
                        </TouchableOpacity>
                    </Header>
                ) : <View />}
                <Content
                    style={{ flex: 1 }}
                >
                    <Text style={styles.text} >{data}</Text>
                </Content>
            </Container>
        )
    }
}

TextViewer.defaultProps = {
    hasHeader: true,
}

const styles = StyleSheet.create({
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    title: {
        alignSelf: "center",
        color: 'white'
    },
    text: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: AppCommon.font_size,
        textAlign: 'justify',
        color: '#404040'
    },
    icon: {
        color: 'white',
        fontSize: AppCommon.icon_size
    }
});