import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, View, ActivityIndicator, Modal, Text, Alert } from "react-native";
import {
    DocumentPicker,
    DocumentPickerUtil,
} from 'react-native-document-picker';
import DialogInput from "react-native-dialog-input";
import { AppCommon } from "../../commons/commons";
import { Icon } from "native-base";
import { Actions } from "react-native-router-flux";
import UploadLinkDialog from "./UploadLinkDialog";
import { fileToBase64 } from "../../commons/utilitiesFunction";
import { updatePdf } from "../../api/accountApi";
import { validateFileName } from "../../commons/validation";

const pickerOptions = [
    {
        key: 'images',
        title: 'Upload images in device...',
    },
    {
        key: 'link',
        title: 'Upload link...'
    },
    {
        key: 'evidence',
        title: 'Upload evidence in device...'
    }
]

export default class AddButton extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isShowUploadPicker: false,
            isShowLinkUploadDialog: false,
            isShowFileUploadDialog: false,
            fileNameUpload: '',
        }
    }

    handleShowFilePicker = () => {
        DocumentPicker.show(
            {
                filetype: [DocumentPickerUtil.pdf()],
            },
            (error, response) => {
                console.log('response : ' + JSON.stringify(response));
                if (response !== null) {
                    // console.log('URI : ' + response.uri);
                    fileToBase64(response.uri)
                        .then(database64 => {
                            console.log('database64 : ' + JSON.stringify(database64));
                            this.setState({
                                database64Upload: database64,
                                fileNameUpload: response.fileName,
                                isShowFileUploadDialog: true
                            })
                        })
                }
            }
        )

    }

    handlePickerValue = (item) => {
        this.toggleUploadPicker();
        if (item.key === 'images') {
            Actions.merchant({ flow: this.props })
        } else if (item.key === 'link') {
            this.toggleLinkDialog();
        } else if (item.key === 'evidence') {
            this.handleShowFilePicker();
        }
    }

    handleUploadByFile = (fileName) => {
        if (!validateFileName(fileName)) {
            Alert.alert('Error', 'Your file name just use alphabet, numbers and underscore');
            return;
        }
        let type = 'FILE';
        let data = {
            base64: this.state.database64Upload,
            fileNameUpload: fileName
        }
        this.handleUploadItem(type, data);
    }

    handleUploadByLink = (link, fileName) => {
        if (!validateFileName(fileName)) {
            Alert.alert('Error', 'Your file name just use alphabet, numbers and underscore');
            return;
        }
        let type = 'LINK';
        let data = {
            linkUpload: link,
            fileNameUpload: fileName
        }
        this.handleUploadItem(type, data);
    }

    handleUploadItem = (type, data) => {
        this.setState({
            isShowLinkUploadDialog: false,
            isShowFileUploadDialog: false,
            isLoading: true
        })
        var data = {
            type: type,
            link: (type === 'LINK') ? data.linkUpload : null,
            file: (type === 'FILE') ? data.base64 : null,
            sarId: this.props.sarInfo.id,
            criterionId: this.props.criterionInfo.id,
            subCriterionId: this.props.subCriterionInfo.id,
            suggestionId: this.props.suggestionInfo.id,
            name: data.fileNameUpload,
        }
        updatePdf(this.props.token, data)
            .then((responseJson) => {
                this.setState({
                    isLoading: false
                })
                console.log('responseJson: ' + JSON.stringify(responseJson));
                if (responseJson.success === false) {
                    Alert.alert('Error', 'Invalid data. Please check your data input.');
                } else {
                    if (responseJson.msg === 'Upload file successful') {
                        Alert.alert(
                            'Success',
                            responseJson.msg,
                            [
                                { text: 'OK', onPress: () => this.props.handleRefresh() }
                            ]
                        );
                    }
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false
                })
                console.log('Error: ' + error);
                Alert.alert('Error', error);
            });
    }

    toggleLinkDialog = () => {
        this.setState({
            isShowLinkUploadDialog: !this.state.isShowLinkUploadDialog
        })
    }

    toggleUploadPicker = () => {
        this.setState({
            isShowUploadPicker: !this.state.isShowUploadPicker
        })
    }

    render() {
        const { isShowUploadPicker, isShowFileUploadDialog, isShowLinkUploadDialog, isLoading } = this.state
        return (
            <View>
                <TouchableOpacity style={styles.addButton} onPress={() => isLoading ? null : this.toggleUploadPicker()}>
                    {isLoading ? (
                        <ActivityIndicator animating color="#FFF" size="large"/>
                    ): (
                        <Icon name = {AppCommon.icon("add")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    )}
                </TouchableOpacity>
                <Modal
                    visible={isShowUploadPicker}
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalHeader}>Please choose how to upload</Text>
                            {pickerOptions.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => this.handlePickerValue(item)} style={{ paddingVertical: 12 }}>
                                        <Text style={{ fontSize: 18, color: '#1a1a1a' }}>{item.title}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                            <TouchableOpacity onPress={() => this.toggleUploadPicker()} style={{ alignItems: 'flex-end', marginTop: 10 }}>
                                <Text style={{ fontSize: 15, color: AppCommon.colors }}>CANCEL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <DialogInput isDialogVisible={isShowFileUploadDialog}
                    title={"Set name for doc to upload"}
                    hintInput={this.state.fileNameUpload}
                    submitText={"Set"}
                    submitInput={(inputText) => { this.handleUploadByFile(inputText) }}
                    closeDialog={() => { this.setState({ isShowFileUploadDialog: false }) }}>
                </DialogInput>
                <UploadLinkDialog
                    isDialogVisible={isShowLinkUploadDialog}
                    handleUploadLink={this.handleUploadByLink}
                    toggleLinkDialog={this.toggleLinkDialog}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    addButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        bottom: 20,
        right: 20,
        borderRadius: 60,
        backgroundColor: AppCommon.colors,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 25,
        display: 'flex',
    },
    modalHeader: {
        paddingBottom: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    }
})