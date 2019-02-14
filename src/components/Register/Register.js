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
    Toast,
    Root
} from 'native-base';
import {Actions} from "react-native-router-flux";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmedPassword: ''
        }
    }

    handleRegister = () => {
        if (this.state.email === '' || this.state.password === '' || this.state.confirmedPassword === '') {
            Toast.show({
                text: "Please complete all information",
                type: "warning",
                buttonText: "Okay",
                duration: 3000
            });
        } else if (this.state.password !== this.state.confirmedPassword) {
            Toast.show({
                text: "Password does not match",
                type: "warning",
                buttonText: "Okay",
                duration: 3000
            });
        } else {
            Toast.show({
                text: "Register successful",
                type: "success",
                buttonText: "Okay"
            });
        }
    };

    render() {
        return (
            <Root>
                <Container>
                    <Button transparent onPress = {() => Actions.pop()}>
                        <Icon name='ios-arrow-back' />
                    </Button>
                    <Content style = {styles.content}>
                        <Form>
                            <InputGroup style={styles.dataInput}>
                                <Icon name='person' style={styles.icon}/>
                                <Input
                                    style = {styles.textInput}
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onChangeText={email => this.setState({ email: email })}
                                />
                            </InputGroup>
                            <InputGroup style={styles.dataInput}>
                                <Icon name='lock' style={styles.icon}/>
                                <Input
                                    style = {styles.textInput}
                                    placeholder="Password"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    onChangeText={password => this.setState({ password: password })}
                                />
                            </InputGroup>
                            <InputGroup style={styles.dataInput}>
                                <Icon name='lock' style={styles.icon}/>
                                <Input
                                    style = {styles.textInput}
                                    placeholder="Confirm Password"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    onChangeText={confirmedPassword => this.setState({ confirmedPassword: confirmedPassword })}
                                />
                            </InputGroup>
                        </Form>
                        <Button rounded block info style = {styles.button} onPress = {() => this.handleRegister()}>
                            <Text style={styles.textButton}>SIGN UP</Text>
                        </Button>
                    </Content>
                </Container>
            </Root>
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
