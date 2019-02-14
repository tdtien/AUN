import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { Container, Header, Content, Form, Icon, Item, Input,Left,Right,Body,Title,Button } from 'native-base';
import {Actions} from "react-native-router-flux";

type Props = {};
export default class Register extends Component<Props> {
    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress = {() => Actions.login()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Header</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Text style={styles.statusFont}>REGISTER</Text>
                    <Form>
                        <Item>
                            <Input placeholder="Enter Email..." />
                        </Item>
                        <Item last>
                            <Input placeholder="Enter Password..." />
                        </Item>
                    </Form>
                    <Button rounded block info style = {styles.buttonStyle}>
                        <Text style={styles.textStyle}>REGISTER</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    statusFont: {
        marginTop: 50,
        marginBottom: 30,
        fontSize: 40,
        fontWeight: 'bold',
        textShadowColor:'#585858',
        textShadowOffset:{width: 1, height: 1},
        textShadowRadius:10,
        color: 'green',
        height: 50,
        textAlign: 'center',
    },
    textStyle: {
        margin: '5%',
        alignSelf: 'center',
        color: 'white',
    },
    buttonStyle: {
        margin: '5%',
    }
});
