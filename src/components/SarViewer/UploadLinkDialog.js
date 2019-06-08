import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, View, Modal } from "react-native";
import { Form, Text, InputGroup, Icon, Input } from "native-base";
import { AppCommon } from "../../commons/commons";
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';

export default class UploadLinkDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            linkUpload: '',
            fileNameUpload: '',
        }
    }

    render() {
        const { isDialogVisible, handleUploadLink, toggleLinkDialog } = this.props;
        const { linkUpload, fileNameUpload } = this.state;
        return (
            <View>
                <Modal
                    visible={isDialogVisible}
                    transparent={true}
                >
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <Text style={styles.header}>{I18n.t(keys.SarExplorer.AddButton.UploadLinkDialog.lblTitle)}</Text>
                            <Form>
                                <InputGroup style={styles.dataInput}>
                                    <Icon name={AppCommon.icon("link")} style={{ color: 'black', fontSize: AppCommon.icon_size }} />
                                    <Input
                                        style={styles.textInput}
                                        placeholder={I18n.t(keys.SarExplorer.AddButton.UploadLinkDialog.lblLinkPlaceholder)}
                                        autoCapitalize="none"
                                        onChangeText={linkUpload => this.setState({ linkUpload: linkUpload })}
                                    />
                                </InputGroup>
                                <InputGroup style={styles.dataInput}>
                                    <Icon name="filetext1" type="AntDesign" style={{ color: 'black', fontSize: AppCommon.icon_size }} />
                                    <Input
                                        style={styles.textInput}
                                        placeholder={I18n.t(keys.SarExplorer.AddButton.UploadLinkDialog.lblFileNamePlaceholder)}
                                        onChangeText={fileNameUpload => this.setState({ fileNameUpload: fileNameUpload })}
                                    />
                                </InputGroup>
                            </Form>
                            <View style={styles.footer}>
                                <TouchableOpacity onPress={() => toggleLinkDialog()} style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 15, color: AppCommon.colors }}>{I18n.t(keys.Common.lblCancel).toUpperCase()}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleUploadLink(linkUpload, fileNameUpload)} style={{ marginTop: 10, marginLeft: 20 }}>
                                    <Text style={{ fontSize: 15, color: AppCommon.colors }}>{I18n.t(keys.Common.lblUpload).toUpperCase()}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    header: {
        paddingBottom: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    },
    content: {
        backgroundColor: 'white',
        padding: 20,
        // display: 'flex',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    dataInput: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        marginLeft: 10,
        marginTop: 5
    }
})