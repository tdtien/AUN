import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, Platform, StatusBar } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { setFirstTime } from '../../actions/account';

const slides = [
    {
        key: '2',
        title: 'SAR Editor',
        text: 'Upload/download file and manage criterion, implications, questions, evidences and more....',
        image: require('../../assets/img/3.png'),
        backgroundColor: '#60B0AF',
    },
    {
        key: '3',
        title: 'SAR Viewer',
        text: 'You can review Self-Assessment Report and comment, note in criteria',
        image: require('../../assets/img/2.png'),
        backgroundColor: '#19D7CD',
    }
];

export class Welcome extends Component {
    _renderItem = (item) => {
        return (
            <View style={[styles.mainContent, { backgroundColor: item.backgroundColor }]}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Image source={item.image} style={[styles.image]} />
                </View>
                <Text style={styles.text}>{item.text}</Text>
            </View>
        );
    }
    _onDone = () => {
        this.props.setFirstTime(false)
        Actions.replace('drawerMenu')
    }
    render() {
        return (
            <AppIntroSlider
                renderItem={this._renderItem}
                slides={slides}
                onDone={this._onDone}
                showSkipButton={true}
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
        resizeMode: 'contain',
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
    }
});

const mapDispatchToProps = dispatch => {
    return {
        setFirstTime: toggle => {
            dispatch(setFirstTime(toggle));
        }
    };
};

export default connect(mapDispatchToProps)(Welcome)
