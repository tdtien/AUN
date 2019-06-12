import React from 'react';
import {
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    View,
    Text,
    NetInfo
} from 'react-native';
import {
    Header,
    Body,
    Title,
    Container,
    Icon,
} from "native-base";
import Pdf from 'react-native-pdf';
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';
import Loader from '../Loader/Loader'
import { uploadEvidence } from '../../api/accountApi';
import { AppCommon } from '../../commons/commons';
import DialogInput from "react-native-dialog-input";
import { validateFileName } from '../../commons/validation';
import { deleteItem, popToSceneWithUpdate, cachePdf, findPdfCacheItem, getTextsFromUploadFlow, createDirectoryTreeWith, downloadAllEvidences } from '../../commons/utilitiesFunction';
import BreadCrumb from '../Breadcrumb/Breadcrumb';
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";
import { setDirectoryInfo } from '../../actions/directoryAction';

class PDFViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: false,
            isLoading: false,
            isDialogVisible: false,
            isShowPdfView: false,
            screenWidth: Dimensions.get('window').width,
            currentEvidence: this.props.currentEvidence,
            evidenceArray: this.props.evidenceArray,
            fileName: this.props.fileName,
            breadcrumbIndex: 3,
        }
    }

    componentDidMount() {
        Dimensions.addEventListener(
            'change',
            this._handleUpdateScreenSize
        );
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done((isConnected) => {
            this.setState({
                isConnected: isConnected
            });
        });
    }

    componentWillUnmount() {
        Dimensions.removeEventListener(
            'change',
            this._handleUpdateScreenSize
        );
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
    }

    handleConnectionAlready = () => {
        let messageKey = this.state.isConnected ? keys.Common.alertNetworkRequestSuccess : keys.Common.alertNetworkRequestFail;
        Alert.alert(I18n.t(keys.Common.lblNotification), I18n.t(messageKey),
            [
                {
                    text: I18n.t(keys.Common.lblNo),
                    style: 'cancel',
                },
                {
                    text: I18n.t(keys.Common.lblYes),
                    onPress: () => {
                        popToSceneWithUpdate('_sarExplorer');
                    }
                }
            ])
    }

    handleConnectivityChange = (isConnected) => {
        this.setState({
            isConnected: isConnected
        },
            () => this.handleConnectionAlready()
        )
    };

    componentWillUpdate(nextProps, nextState) {
        if (nextState.evidenceArray !== nextProps.evidenceArray) {
            nextState.currentEvidence = nextProps.currentEvidence;
            nextState.evidenceArray = nextProps.evidenceArray;
        }
    }

    _handleUpdateScreenSize = (size) => {
        const { width, height } = size.window;
        this.setState({
            screenWidth: width,
        });
    }

    handleUploadPdf = (fileName) => {
        if (!validateFileName(fileName)) {
            Alert.alert(I18n.t(keys.Common.lblError), I18n.t(keys.Common.alertInvalidFileName));
            return;
        }
        this.setState({
            isDialogVisible: false,
            isLoading: true
        })
        var data = {
            type: 'FILE',
            file: this.props.base64,
            suggestionId: this.props.flow.suggestionInfo.id,
            name: fileName
        }
        uploadEvidence(this.props.token, data)
            .then((responseJson) => {
                console.log('responseJson: ' + responseJson.msg);
                if (responseJson.success === true) {
                    this.setState({
                        isLoading: false,
                        breadcrumbIndex: 4,
                    })
                    Alert.alert(
                        I18n.t(keys.Common.lblSuccess),
                        I18n.t(keys.PDFViewer.alertDeleteFolderImages),
                        [
                            {
                                text: I18n.t(keys.Common.lblNo),
                                style: 'cancel',
                                onPress: () => popToSceneWithUpdate('_sarExplorer', this.props.flow),
                            },
                            {
                                text: I18n.t(keys.Common.lblYes),
                                onPress: () => {
                                    this.setState({
                                        isLoading: true
                                    })
                                    deleteItem(this.props.imageFolderPath).then(result => {
                                        this.setState({
                                            isLoading: false
                                        }, () => popToSceneWithUpdate('_sarExplorer', this.props.flow))
                                    }).catch(error => {
                                        this.setState({
                                            isLoading: false
                                        }, () => Alert.alert(I18n.t(keys.Common.lblError), error.message))
                                    })
                                }
                            }
                        ]
                    );
                }
                else {
                    Alert.alert(I18n.t(keys.Common.lblError), responseJson.msg);
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false
                })
                console.error('Error: ' + error);
                Alert.alert(I18n.t(keys.Common.lblError), error);
            });
    }

    handleViewEvidences = (type) => {
        let length = this.state.evidenceArray.length;
        let currentIndex = this.state.evidenceArray.findIndex(item => item.id === this.state.currentEvidence.id);
        let newIndex = (type === 'next') ? (currentIndex + 1) : (currentIndex - 1);
        if (newIndex === length || newIndex < 0) {
            return;
        }
        this.setState({
            currentEvidence: this.state.evidenceArray[newIndex],
            fileName: this.state.evidenceArray[newIndex].name,
        });
    }

    handleDownload = () => {
        let { flow, email } = this.props;
        let { currentEvidence } = this.state;
        let type = 'evidence';
        this.setState({
            isLoading: true
        })
        let pdfFolderPath = AppCommon.directoryPath + AppCommon.pdf_dir + '/' + email;
        let directoryTree = createDirectoryTreeWith(flow, currentEvidence, type);
        downloadAllEvidences(directoryTree, pdfFolderPath)
            .then(response => {
                if (response) {
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                    })
                    var directoryInfo = {
                        email: email,
                        directoryTree: response,
                        downloadItemType: type,
                        downloadFlow: flow
                    }
                    // console.log('directoryInfo: ' + JSON.stringify(directoryInfo));
                    this.props.setDirectoryInfo(directoryInfo);
                    Alert.alert(I18n.t(keys.SarExplorer.Main.lblDownloadOption), I18n.t(keys.SarExplorer.Main.alertDownloadSuccess));
                }
            }).catch(error => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                })
                console.error('Error when download: ' + error);
                Alert.alert(I18n.t(keys.SarExplorer.Main.lblDownloadOption), I18n.t(keys.SarExplorer.Main.alertDownloadFail));
            })
    }

    handlePopTo = (index, isRoot = false) => {
        let sceneKey = '';
        if (isRoot) {
            sceneKey = '_sarExplorer';
        } else if (AppCommon.uploadFlow[index].scene === 'pdfViewer') {
            this.setState({
                breadcrumbIndex: 3,
            })
            return;
        } else {
            sceneKey = AppCommon.uploadFlow[index].scene;
        }
        Actions.popTo(sceneKey);
    }

    render() {
        let { evidenceArray, base64, hasHeader, width } = this.props;
        let { currentEvidence, screenWidth, isShowPdfView, isDialogVisible, fileName, isLoading, breadcrumbIndex, isConnected } = this.state
        let uploadFlow = getTextsFromUploadFlow();
        let uri = '';
        if (base64 !== null) {
            uri = `data:application/pdf;base64,${base64}`;
        } else {
            let item = findPdfCacheItem(currentEvidence.id);
            if (typeof item !== 'undefined') {
                uri = item.path;
            } else {
                uri = currentEvidence.link;
            }
        }
        let pdfArrayView = (base64 === null && typeof evidenceArray !== 'undefined' && evidenceArray.length > 1) ? (
            <View
                style={{
                    width: width == -1 ? screenWidth : width,
                    height: 40,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#cccccc',
                    paddingHorizontal: 20,
                    opacity: 0.5,
                }}
            >
                <TouchableOpacity onPress={() => this.handleViewEvidences('back')}>
                    <Text style={{ fontSize: 17, color: 'black' }}>{I18n.t(keys.PDFViewer.btnBack)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleViewEvidences('next')}>
                    <Text style={{ fontSize: 17, color: 'black' }}>{I18n.t(keys.PDFViewer.btnNext)}</Text>
                </TouchableOpacity>
            </View>
        ) : null
        return (
            <Container>
                {hasHeader ? (
                    <Header
                        androidStatusBarColor={AppCommon.colors}
                        iosBarStyle="light-content"
                        style={{ backgroundColor: AppCommon.colors }}
                        hasTabs
                    >
                        <TouchableOpacity style={styles.headerButton} onPress={() => Actions.pop()} >
                            <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                        </TouchableOpacity>
                        <Body style={{ flex: 1 }}>
                            <Title style={{ alignSelf: "center", color: "white" }}>{this.state.fileName}</Title>
                        </Body>
                        {
                            (base64 !== null) ? (
                                <TouchableOpacity style={styles.headerButton} onPress={() => this.setState({ isDialogVisible: true })} >
                                    <Icon name={AppCommon.icon("cloud-upload")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                                </TouchableOpacity>
                            ) : (isConnected ? (
                                <View style={styles.headerMoreButton}>
                                    <Menu>
                                        <MenuTrigger customStyles={triggerStyles}>
                                            <Icon name={AppCommon.icon("more")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                                        </MenuTrigger>
                                        <MenuOptions>
                                            <MenuOption onSelect={() => this.handleDownload()}>
                                                <View style={styles.popupItem}>
                                                    <Icon name={AppCommon.icon("download")} style={{ color: AppCommon.colors, fontSize: AppCommon.icon_size }} />
                                                    <Text style={styles.popupItemText}>{I18n.t(keys.PDFViewer.btnDownload)}</Text>
                                                </View>
                                            </MenuOption>
                                        </MenuOptions>
                                    </Menu>
                                </View>
                            ) : <View />)
                        }
                    </Header>
                ) : <View />}
                {base64 === null ? <View /> :
                    <BreadCrumb
                        isConnected={false}
                        handlePress={this.handlePopTo}
                        previousItem={uploadFlow.slice(0, breadcrumbIndex)}
                        currentItem={uploadFlow[breadcrumbIndex]}
                        nextItem={uploadFlow.slice(breadcrumbIndex + 1, uploadFlow.length)}
                    />
                }
                {(isShowPdfView) ? pdfArrayView : null}
                <View style={styles.container}>
                    <Pdf
                        onLoadProgress={() => {
                            <ActivityIndicator
                                animating
                                color={AppCommon.colors}
                            />
                        }}
                        onLoadComplete={(num, path) => {
                            base64 === null ? cachePdf(currentEvidence.id, path) : null
                        }}
                        source={{ uri: uri }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        style={{
                            flex: 1,
                            width: width == -1 ? screenWidth : width
                        }}
                        onPageSingleTap={() => {
                            this.setState({
                                isShowPdfView: !isShowPdfView
                            })
                        }}
                        fitPolicy={0}
                    />
                </View>
                <DialogInput isDialogVisible={isDialogVisible}
                    title={I18n.t(keys.PDFViewer.lblUploadDialogTitle)}
                    hintInput={fileName}
                    submitText={I18n.t(keys.Common.lblSet)}
                    cancelText={I18n.t(keys.Common.lblCancel)}
                    submitInput={(inputText) => { this.handleUploadPdf(inputText) }}
                    closeDialog={() => { this.setState({ isDialogVisible: false }) }}>
                </DialogInput>
                <Loader loading={this.state.isLoading} />
            </Container>
        )
    }
}

PDFViewer.defaultProps = {
    hasHeader: true,
    width: -1
}

const mapStateToProps = state => {
    return {
        token: state.account.token,
        email: state.account.email,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setDirectoryInfo: item => {
            dispatch(setDirectoryInfo(item));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PDFViewer);

const triggerStyles = {
    triggerWrapper: {
        padding: 10,
    },
    TriggerTouchableComponent: TouchableOpacity,
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#F7F5F5'
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 10
    },
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