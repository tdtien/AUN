import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {
    Icon,
    Footer,
    Right
} from 'native-base';
import { AppCommon } from '../../commons/commons';

export default class DownloadButton extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Footer
                style={{ backgroundColor: AppCommon.colors }}
            >
                <Right>
                    <View style={styles.footerButton}>
                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => this.props.parentView.handleDownloadItem()} >
                            <Icon name={AppCommon.icon("cloud-download")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                        </TouchableOpacity>
                    </View>
                </Right>
            </Footer>
        )
    }
}

const styles = StyleSheet.create({
    footerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20
    },
});