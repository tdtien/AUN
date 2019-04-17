import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    ActivityIndicator,
    StatusBar
} from 'react-native';
import { AppCommon } from '../../commons/commons';

const Loader = props => {
    const {
        loading,
        ...attributes
    } = props;

    return (
        <Modal
            transparent={true}
            animationType={'none'}
            visible={loading}
            onRequestClose={() => { console.log('close modal') }}>
            <StatusBar backgroundColor={AppCommon.colors} barStyle="dark-content" />
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator
                        size="large"
                        animating={loading}
                        color={AppCommon.colors}
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    activityIndicatorWrapper: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Loader;