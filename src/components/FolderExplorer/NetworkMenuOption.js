import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import {
    Icon,
} from 'native-base';
import { AppCommon } from '../../commons/commons';
import {
    MenuContext,
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

export default class NetworkMenuOption extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.headerMoreButton}>
                <Menu>
                    <MenuTrigger customStyles={triggerStyles}>
                        <Icon name={AppCommon.icon("more")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </MenuTrigger>
                    <MenuOptions optionsContainerStyle={{ marginTop: 50 }}>
                        <MenuOption onSelect={() => this.props.parentView.handleNetworkConnection(true)}>
                            <View style={styles.popupItem}>
                                <Icon name="wifi" type="Feather" style={{ color: 'blue', fontSize: AppCommon.icon_size }} />
                                <Text style={styles.popupItemText}>View online</Text>
                            </View>
                        </MenuOption>
                        <MenuOption onSelect={() => this.props.parentView.handleNetworkConnection(false)}>
                            <View style={styles.popupItem}>
                                <Icon name="wifi-off" type="Feather" style={{ color: 'blue', fontSize: AppCommon.icon_size }} />
                                <Text style={styles.popupItemText}>View offline</Text>
                            </View>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>
        )
    }
}

const triggerStyles = {
    triggerWrapper: {
        padding: 10,
    },
    TriggerTouchableComponent: TouchableOpacity,
};

const styles = StyleSheet.create({
    headerMoreButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    popupItem: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    popupItemText: {
        paddingLeft: 25,
        fontSize: 17,
        color: '#2F4F4F'
    }
});