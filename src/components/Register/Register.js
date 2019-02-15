import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
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
import {requestRegister} from '../../api/accountApi'
import {validateEmail, validatePassword} from "../../commons/validation";

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
                text: 'Please complete all information',
                type: 'warning',
                buttonText: 'Okay',
                duration: 3000
            });
        } else if (this.state.password !== this.state.confirmedPassword) {
            Toast.show({
                text: 'Password does not match',
                type: 'warning',
                buttonText: 'Okay',
                duration: 3000
            });
        } else {
            if (!validateEmail(this.state.email)) {
                Toast.show({
                    text: "Your email is invalid",
                    type: "danger",
                    buttonText: "Okay",
                    duration: 3000
                });
            } else if (!validatePassword(this.state.password)) {
                Toast.show({
                    text: "Your password must contain at least 8 characters and no special characters",
                    type: "danger",
                    buttonText: "Okay",
                    duration: 3000
                });
            } else {
                requestRegister(this.state.email, this.state.password)
                    .then(result => {
                        Alert.alert('Success','Register successful',
                            [{text: 'OK', onPress: () => {Actions.pop()}}]);
                    }).catch(error => {
                    Toast.show({
                        text: error.response.data.msg,
                        type: 'danger',
                        buttonText: 'Okay',
                        duration: 3000
                    });
                })
            }
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
