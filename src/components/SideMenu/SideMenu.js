import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity} from "react-native";


export default class SideMenu extends Component<{}> {
    constructor(props) {
        super(props);

    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress = {() => null}>
                    <Text style = {styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#F5FCFF',
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 10,
    },
    button: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray'
    },
    buttonText: {
        fontSize: 25,
        fontWeight: 'bold'
    }
});