import React from 'react';
import {
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    View,
    Text,
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
import { deleteItem, popToSceneWithUpdate, cachePdf, findPdfCacheItem } from '../../commons/utilitiesFunction';
import BreadCrumb from '../Breadcrumb/Breadcrumb';

class PDFViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isDialogVisible: false,
            isShowPdfView: false,
            screenWidth: Dimensions.get('window').width,
            currentEvidence: this.props.currentEvidence,
            evidenceArray: this.props.evidenceArray,
            fileName: this.props.fileName,
        }
    }

    componentDidMount() {
        Dimensions.addEventListener(
            'change',
            this._handleUpdateScreenSize
        );
    }

    componentWillUnmount() {
        Dimensions.removeEventListener(
            'change',
            this._handleUpdateScreenSize
        );
    }

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
            Alert.alert('Error', 'Your file name just use alphabet, numbers and underscore');
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
                if (responseJson.msg === 'Upload file successful') {
                    this.setState({
                        isLoading: false,
                    })
                    let message = responseJson.msg + '\r\n' + 'Do you want to delete the image folder ?'
                    Alert.alert(
                        'Success',
                        message,
                        [
                            {
                                text: 'No',
                                style: 'cancel',
                                onPress: () => popToSceneWithUpdate('_sarExplorer', this.props.flow),
                            },
                            {
                                text: 'Yes', onPress: () => {
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
                                        }, () => Alert.alert('Error', error.message))
                                    })
                                }
                            }
                        ]
                    );
                }
                else {
                    Alert.alert('Error1', responseJson.msg);
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false
                })
                console.error('Error: ' + error);
                Alert.alert('Error2', error);
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

    handlePopTo = (index, isRoot = false) => {
        let sceneKey = '';
        if (isRoot) {
            sceneKey = '_sarExplorer';
        } else {
            sceneKey = AppCommon.uploadFlow[index].key;
        }
        Actions.popTo(sceneKey);
    }

    render() {
        let { evidenceArray, base64, hasHeader, width } = this.props;
        let { currentEvidence, screenWidth, isShowPdfView, isDialogVisible, fileName, isLoading } = this.state
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
        let pdfArrayView = (typeof evidenceArray !== 'undefined' && evidenceArray.length > 1) ? (
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
                    <Text style={{ fontSize: 17, color: 'black' }}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleViewEvidences('next')}>
                    <Text style={{ fontSize: 17, color: 'black' }}>Next</Text>
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
                            (this.props.flow !== null) ? (
                                <TouchableOpacity style={styles.headerButton} onPress={() => this.setState({ isDialogVisible: true })} >
                                    <Icon name={AppCommon.icon("cloud-upload")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                                </TouchableOpacity>
                            ) : (
                                    <TouchableOpacity style={styles.headerButton} onPress={() => null} >
                                        <Icon name={AppCommon.icon("more")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                                    </TouchableOpacity>
                                )
                        }

                    </Header>
                ) : <View />}
                {base64 === null ? <View /> :
                    <BreadCrumb
                        isConnected={false}
                        handlePress={this.handlePopTo}
                        previousItem={AppCommon.uploadFlow.slice(0, 3)}
                        currentItem={AppCommon.uploadFlow[3]}
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
                    title={"Set name for doc to upload"}
                    hintInput={fileName}
                    submitText={"Set"}
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
    };
};

export default connect(mapStateToProps)(PDFViewer);

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
    }
});