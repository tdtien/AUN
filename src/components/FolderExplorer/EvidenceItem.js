import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import {
    Icon,
} from 'native-base';
import { AppCommon } from '../../commons/commons';
import Loader from '../Loader/Loader';
import { Actions } from 'react-native-router-flux';

export default class EvidenceItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
    }

    handleOpenPdfFile = (item) => {
        Actions.pdfViewer({ fileName: item.name, base64: null, link: item.link, flow: null });
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => this.handleOpenPdfFile(this.props.item)}>
                <View style={styles.item}>
                    <View style={styles.leftItem}>
                        <Icon name='pdffile1' type="AntDesign" style={{ color: AppCommon.colors, fontSize: AppCommon.icon_size }} />
                        <Text style={{ color: 'black', paddingHorizontal: 15, fontSize: AppCommon.font_size }} numberOfLines={3}>{this.props.item.name}</Text>
                    </View>
                    {/* <Icon name={AppCommon.icon('more')} style={{ color: 'gray', fontSize: AppCommon.icon_size }} /> */}
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ECE9E9',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    leftItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    }
});