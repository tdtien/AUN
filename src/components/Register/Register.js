import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
    Container,
    Content,
    Form,
    Icon,
    Item,
    Input,
    InputGroup,
    Button,
    Label,
} from 'native-base';
import {Actions} from "react-native-router-flux";

type Props = {};
export default class Register extends Component<Props> {
    render() {
        return (
            <Container>
                <Button transparent onPress = {() => Actions.pop()}>
                    <Icon name='ios-arrow-back' />
                </Button>
                <Content style = {styles.content}>
                    <Form>
                        <InputGroup style={styles.dataInput}>
                            <Icon name='person' style={styles.icon}/>
                            <Input placeholder="Email" style = {styles.textInput}/>
                        </InputGroup>
                        <InputGroup style={styles.dataInput}>
                            <Icon name='lock' style={styles.icon}/>
                            <Input placeholder="Password" style = {styles.textInput}/>
                        </InputGroup>
                        <InputGroup style={styles.dataInput}>
                            <Icon name='lock' style={styles.icon}/>
                            <Input placeholder="Confirm Password" style = {styles.textInput}/>
                        </InputGroup>
                    </Form>
                    <Button rounded block info style = {styles.button}>
                        <Text style={styles.textButton}>SIGN UP</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        paddingRight: 50,
        paddingLeft: 50,
    },
    textButton: {
        margin: '5%',
        alignSelf: 'center',
        color: 'white',
    },
    button: {
        margin: '5%',
    },
    icon: {
        fontSize:25,
        color: 'black'
    },
    dataInput: {
        marginBottom: 10
    },
    textInput: {
        marginLeft: 5
    }
});
