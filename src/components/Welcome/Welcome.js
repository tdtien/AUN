import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, Platform, StatusBar } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { setFirstTime } from '../../actions/account';
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';

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
        this.props.toggleFirstTime(false)
        Actions.replace('drawerMenu')
    }
    render() {
        let slides = [
            {
                key: '2',
                title: I18n.t(keys.Welcome.lblSarEditor),
                text: I18n.t(keys.Welcome.lblSarEditorDescription),
                image: require('../../assets/img/3.png'),
                backgroundColor: '#60B0AF',
            },
            {
                key: '3',
                title: I18n.t(keys.Welcome.lblSarViewer),
                text: I18n.t(keys.Welcome.lblSarViewerDescription),
                image: require('../../assets/img/2.png'),
                backgroundColor: '#19D7CD',
            }
        ];
        return (
            <AppIntroSlider
                renderItem={this._renderItem}
                slides={slides}
                onDone={this._onDone}
                showSkipButton={true}
                skipLabel={I18n.t(keys.Welcome.btnSkip)}
                nextLabel={I18n.t(keys.Welcome.btnNext)}
                doneLabel={I18n.t(keys.Welcome.btnDone)}
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
        toggleFirstTime: toggle => {
            dispatch(setFirstTime(toggle));
        }
    };
};

const mapStateToProps = state => {
    return {
        id: state.account.id,
        token: state.account.token,
        isFirstTime: state.account.isFirstTime
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
