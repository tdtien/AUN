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
import RNFS from "react-native-fs";

export default class EvidenceItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
    }

    handleOpenPdfFile = (item) => {
        this.setState({ isLoading: true })
        // console.log('base64: ' + item.dataBase64);
        // console.log('token: ' + this.props.token);
        if (item.hasOwnProperty('dataBase64')) {
            let folderPath = AppCommon.directoryPath + AppCommon.pdf_dir;
            let fileName = item.name;
            let filePath = folderPath + "/" + fileName;
            let that = this;
            RNFS.exists(folderPath).then((response) => {
                if (!response) {
                    RNFS.mkdir(folderPath).then((response) => {
                        RNFS.writeFile(filePath, item.dataBase64, "base64")
                            .then(function (response) {
                                console.log('Pdf is saved');
                                Actions.pdfViewer({ filePath: `file://${filePath}`, fileName: fileName, base64: item.dataBase64 });
                            }).catch(function (error) {
                                console.log(error);
                            })
                    })
                } else {
                    RNFS.writeFile(filePath, item.dataBase64, "base64")
                        .then(function (response) {
                            console.log('Pdf is saved');
                            Actions.pdfViewer({ filePath: `file://${filePath}`, fileName: fileName, base64: item.dataBase64 });
                        }).catch(function (error) {
                            console.log(error);
                        })
                }
            })
        }
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.handleOpenPdfFile(this.props.item)}>
                <View style={styles.item}>
                    <View style={styles.leftItem}>
                        <Icon name='pdffile1' type="AntDesign" style={{ color: 'deepskyblue', fontSize: AppCommon.icon_largeSize }} />
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