import React, { Component } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider';
import { Actions } from 'react-native-router-flux';

const slides = [
    {
        key: '1',
        title: 'Welcome to AUN Inspection System',
        text: 'This is a tool to view and edit Self-Assessment Report',
        image: require('../../assets/img/1.jpg'),
        backgroundColor: '#59b2ab',
    },
    {
        key: 'somethun-dos',
        title: 'Title 2',
        text: 'Other cool stuff',
        image: require('../../assets/img/2.jpeg'),
        backgroundColor: '#febe29',
    },
    {
        key: 'somethun1',
        title: 'Rocket guy',
        text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
        image: require('../../assets/img/3.jpeg'),
        backgroundColor: '#22bcb5',
    }
];

export class Welcome extends Component {
    _renderItem = (item) => {
        return (
            <View style={[styles.mainContent, { backgroundColor: item.backgroundColor }]}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Image source={item.image} style={styles.image} />
                </View>
                <Text style={styles.text}>{item.text}</Text>
            </View>
        );
    }
    _onDone = () => {
        // User finished the introduction. Show real app through
        // navigation or simply by controlling state
        Actions.pop()
    }
    render() {
        return (
            <AppIntroSlider
                renderItem={this._renderItem}
                slides={slides}
                onDone={this._onDone}
            />
        )
    }
}

const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    image: {
        width: 320,
        height: 320,
    },
    text: {
        color: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
        marginBottom: 25
    },
    title: {
        fontSize: 22,
        color: 'white',
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginBottom: 16,
    },
});

export default Welcome
