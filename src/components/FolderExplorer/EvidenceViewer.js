import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TouchableHighlight,
    StyleSheet,
    FlatList,
    Modal,
    Alert
} from 'react-native';
import {
    Content,
    Container,
    Icon,
    Header,
    Body,
    Title,
    Form,
    InputGroup,
    Input,
} from 'native-base';
import { getAllEvidences } from '../../api/directoryTreeApi';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader'
import { Actions } from 'react-native-router-flux';
import { AppCommon } from '../../commons/commons';
import EvidenceItem from './EvidenceItem';
import { setDirectoryInfo } from "../../actions/directoryAction";
import {
    createDirectoryTreeWith,
    createFolder,
    downloadAllEvidences,
    fileToBase64
} from '../../commons/utilitiesFunction';
import DownloadButton from './DownloadButton';
import DialogInput from "react-native-dialog-input";
import { uploadEvidence } from '../../api/accountApi';
import {
    DocumentPicker,
    DocumentPickerUtil,
} from 'react-native-document-picker';

const pickerOptions = [
    {
        key: 'images',
        title: 'Upload from images in device...',
    },
    {
        key: 'link',
        title: 'Upload from link...'
    },
    {
        key: 'evidence',
        title: 'Upload from evidence in device...'
    }
]

class EvidenceViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            data: null,
            isShowFooter: false,
            choosenEvidenceItem: {},
            isShowUploadPicker: false,
            isShowLinkUploadDialog: false,
            isShowFileUploadDialog: false,
            linkUpload: '',
            fileNameUpload: '',
            database64Upload: '',
        };
    }

    componentDidMount() {
        this._getAll();
    }

    componentWillReceiveProps(props) {
        this.handleRefresh();
    }

    _getAll = () => {
        if (this.props.isConnected) {
            getAllEvidences(this.props.token, this.props.suggestionInfo.id)
                .then((responseJson) => {
                    // console.log('data evidences: ' + JSON.stringify(responseJson.data));
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                        data: responseJson.data,
                    })
                })
                .catch((error) => {
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                    })
                    console.error('Error: ' + error);
                });
        } else {
            this.setState({
                isLoading: false,
                refreshing: false,
                data: this.props.offlineSuggestionData.evidences,
            })
        }
    }

    handleRefresh = () => {
        this.setState(
            {
                refreshing: true
            },
            () => {
                this._getAll();
            }
        );
    };

    renderItem(item, index) {
        return (
            <EvidenceItem
                item={item}
                parentView={this}
                evidenceArray={this.state.data}
            />
        )
    }

    handleShowFooter = (choosenEvidenceItem) => {
        this.setState({
            isShowFooter: true,
            choosenEvidenceItem: choosenEvidenceItem
        })
    }

    handleDownloadItem = () => {
        this.setState({
            isLoading: true,
        })
        let downloadFlow = {
            sarInfo: this.props.sarInfo,
            criterionInfo: this.props.criterionInfo,
            subCriterionInfo: this.props.subCriterionInfo,
            suggestionInfo: this.props.suggestionInfo,
            evidenceInfo: this.state.choosenEvidenceItem
        }
        let directoryTree = createDirectoryTreeWith(downloadFlow, this.state.choosenEvidenceItem, 'evidence');
        // console.log('directoryTree: ' + JSON.stringify(directoryTree));
        let pdfFolderPath = AppCommon.directoryPath + AppCommon.pdf_dir + '/' + this.props.email;
        downloadAllEvidences(directoryTree, pdfFolderPath)
            .then(response => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                    isShowFooter: false
                })
                var directoryInfo = {
                    email: this.props.email,
                    directoryTree: response,
                    downloadItemType: 'evidence',
                    downloadFlow: downloadFlow
                }
                // console.log('responseJson evidence: ' + JSON.stringify(directoryInfo));
                this.props.setDirectoryInfo(directoryInfo);
            }).catch(error => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                    isShowFooter: false
                })
                console.log('Error when download: ' + error);
            })
    }

    toggleUploadPicker = () => {
        this.setState({
            isShowUploadPicker: !this.state.isShowUploadPicker
        })
    }

    toggleLinkDialog = () => {
        this.setState({
            isShowLinkUploadDialog: !this.state.isShowLinkUploadDialog
        })
    }

    handlePickerValue = (item) => {
        this.setState({
            isShowUploadPicker: false
        })
        if (item.key === 'images') {
            Actions.merchant({ flow: this.props })
        } else if (item.key === 'link') {
            this.setState({
                isShowLinkUploadDialog: true
            })
        } else if (item.key === 'evidence') {
            this.handleShowFilePicker();
        }
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
        uploadEvidence(this.props.token, data)
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
                                { text: 'OK', onPress: () => this.handleRefresh() }
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

    handleUploadByLink = () => {
        let type = 'LINK';
        let data = {
            linkUpload: this.state.linkUpload,
            fileNameUpload: this.state.fileNameUpload
        }
        this.handleUploadItem(type, data);
    }

    handleUploadByFile = (fileName) => {
        let type = 'FILE';
        let data = {
            base64: this.state.database64Upload,
            fileNameUpload: fileName
        }
        this.handleUploadItem(type, data);
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

    render() {
        let leftHeaderButton = (this.state.isShowFooter) ? (
            <TouchableOpacity style={styles.menuButton} onPress={() => {
                this.setState({
                    isShowFooter: false
                })
            }} >
                <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
            </TouchableOpacity>
        ) : (
                <TouchableOpacity style={styles.menuButton} onPress={() => Actions.pop()} >
                    <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                </TouchableOpacity>
            )
        let footer = (this.state.isShowFooter) ?
            (
                <DownloadButton
                    parentView={this}
                />
            ) : (
                (this.props.role !== 'REVIEWER') ? (
                    <TouchableOpacity style={styles.addButton} onPress={() => this.toggleUploadPicker()}>
                        <Icon name={AppCommon.icon("add")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                ) : null
            )
        let uploadPicker = (this.state.isShowUploadPicker) ? (
            <Modal
                visible={true}
                transparent={true}
            >
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    backgroundColor: '#00000040'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        padding: 25,
                        display: 'flex',
                    }}>
                        <Text style={{ paddingBottom: 15, fontSize: 20, fontWeight: 'bold', color: 'black' }}>Please choose how to upload</Text>
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
        ) : null
        let linkUploadDialog = (this.state.isShowLinkUploadDialog) ? (
            <View>
                <Modal
                    visible={true}
                    transparent={true}
                >
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        backgroundColor: '#00000040'
                    }}>
                        <View style={{
                            backgroundColor: 'white',
                            padding: 20,
                            // display: 'flex',
                        }}>
                            <Text style={{ paddingBottom: 15, fontSize: 20, fontWeight: 'bold', color: 'black' }}>Complete information to upload</Text>
                            <Form>
                                <InputGroup style={styles.dataInput}>
                                    <Icon name={AppCommon.icon("link")} style={{ color: 'black', fontSize: AppCommon.icon_size }} />
                                    <Input
                                        style={styles.textInput}
                                        placeholder="Set link..."
                                        autoCapitalize="none"
                                        onChangeText={linkUpload => this.setState({ linkUpload: linkUpload })}
                                    />
                                </InputGroup>
                                <InputGroup style={styles.dataInput}>
                                    <Icon name="filetext1" type="AntDesign" style={{ color: 'black', fontSize: AppCommon.icon_size }} />
                                    <Input
                                        style={styles.textInput}
                                        placeholder="Set file name..."
                                        onChangeText={fileNameUpload => this.setState({ fileNameUpload: fileNameUpload })}
                                    />
                                </InputGroup>
                            </Form>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 10
                            }}>
                                <TouchableOpacity onPress={() => this.toggleLinkDialog()} style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 15, color: AppCommon.colors }}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.handleUploadByLink()} style={{ marginTop: 10, marginLeft: 20 }}>
                                    <Text style={{ fontSize: 15, color: AppCommon.colors }}>UPLOAD</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        ) : null
        return (
            <Container style={{ backgroundColor: AppCommon.background_color }}>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                    rounded
                >
                    {
                        leftHeaderButton
                    }
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center", color: 'white' }}>All Evidences</Title>
                    </Body>
                    <TouchableOpacity style={styles.menuButton} onPress={() => null} >
                        <Icon name={AppCommon.icon("more")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                </Header>
                <Content
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                >
                    {
                        (this.state.data !== null && this.state.data.length === 0) ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#BDBDBD' }}>There is no content</Text>
                            </View>
                        ) : (
                                <FlatList
                                    data={this.state.data}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => this.renderItem(item, index)}
                                    onRefresh={this.handleRefresh}
                                    refreshing={this.state.refreshing}
                                    onEndReached={this.handleLoadMore}
                                    onEndReachedThreshold={50}
                                />
                            )
                    }
                </Content>
                {
                    footer
                }
                {
                    uploadPicker
                }
                {
                    linkUploadDialog
                }
                <DialogInput isDialogVisible={this.state.isShowFileUploadDialog}
                    title={"Set name for doc to upload"}
                    hintInput={this.state.fileNameUpload}
                    submitText={"Set"}
                    submitInput={(inputText) => { this.handleUploadByFile(inputText) }}
                    closeDialog={() => { this.setState({ isShowFileUploadDialog: false }) }}>
                </DialogInput>
                <Loader loading={this.state.isLoading} />
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.account.token,
        email: state.account.email,
        role: state.account.role,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setDirectoryInfo: item => {
            dispatch(setDirectoryInfo(item));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EvidenceViewer);

const styles = StyleSheet.create({
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
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
    dataInput: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        marginLeft: 10,
        marginTop: 5
    }
});