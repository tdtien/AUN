import React from 'react';
import {
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    View,
    Modal,
    Text,
} from 'react-native';
import {
    Header,
    Body,
    Title,
    Container,
    Icon,
    Content,
    Toast
} from "native-base";
import Pdf from 'react-native-pdf';
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';
import Loader from '../Loader/Loader'
import { updatePdf } from '../../api/accountApi';
import { AppCommon } from '../../commons/commons';
import DialogInput from "react-native-dialog-input";
import { validateFileName } from '../../commons/validation';
import { deleteItem, popToSceneWithUpdate } from '../../commons/utilitiesFunction';

class PDFViewer extends React.Component {
    constructor(props) {
        super(props);
        console.log('evidenceArray: ' + JSON.stringify(this.props.evidenceArray));
        console.log('currentEvidence: ' + JSON.stringify(this.props.currentEvidence));
        this.state = {
            isLoading: false,
            isDialogVisible: false,
            isShowPdfView: false,
            screenWidth: Dimensions.get('window').width,
            currentEvidence: this.props.currentEvidence,
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

    _handleUpdateScreenSize = (size) => {
        const { width, height } = size.window;
        this.setState({
            screenWidth: width,
        });
    }

    handleDeleteImageFolder = (folderPath) => {
        Alert.alert(
            'Delete image folder',
            'Do you want to delete the image folder ?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                    onPress: () => popToSceneWithUpdate('evidenceViewer', this.props.flow),
                },
                {
                    text: 'Yes', onPress: () => {
                        this.setState({
                            isLoading: true
                        })
                        deleteItem(folderPath).then(result => {
                            this.setState({
                                isLoading: false
                            })
                            popToSceneWithUpdate('evidenceViewer', this.props.flow)
                        }).catch(error => {
                            this.setState({
                                isLoading: false
                            })
                            Alert.alert('Error', error.message);
                        })
                    }
                }
            ]
        );
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
            sarId: this.props.flow.sarInfo.id,
            criterionId: this.props.flow.criterionInfo.id,
            subCriterionId: this.props.flow.subCriterionInfo.id,
            suggestionId: this.props.flow.suggestionInfo.id,
            name: fileName
        }
        updatePdf(this.props.token, data)
            .then((responseJson) => {
                this.setState({
                    isLoading: false
                })
                console.log('responseJson: ' + responseJson.msg);
                if (responseJson.msg === 'Upload file successful')
                    Alert.alert(
                        'Success',
                        responseJson.msg,
                        [
                            { text: 'OK', onPress: () => this.handleDeleteImageFolder(this.props.imageFolderPath) }
                        ]
                    );
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
        let length = this.props.evidenceArray.length;
        let currentIndex = this.props.evidenceArray.findIndex(item => item.id === this.state.currentEvidence.id);
        let newIndex = (type === 'next') ? (currentIndex + 1) : (currentIndex - 1);
        if (newIndex === length || newIndex < 0) {
            return;
        }
        this.setState({
            currentEvidence: this.props.evidenceArray[newIndex],
            fileName: this.props.evidenceArray[newIndex].name
        });
    }

    render() {
        let fileName = this.props.fileName;
        fileName = fileName.substring(0, fileName.length - 4);
        let uri = (this.props.base64 !== null) ? `data:application/pdf;base64,${this.props.base64}` : this.state.currentEvidence.link;
        let pdfArrayView = (this.props.evidenceArray !== undefined && this.props.evidenceArray.length > 1) ? (
            <View
                style={{
                    width: this.state.screenWidth,
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
            </View >
        ) : null
        return (
            <Container>
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
                {
                    (this.state.isShowPdfView) ? pdfArrayView : null
                }
                <View style={styles.container}>
                    <Pdf
                        onLoadProgress={() => {
                            <ActivityIndicator
                                animating
                                color={AppCommon.colors}
                            />
                        }}
                        source={{ uri: uri }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        style={{
                            flex: 1,
                            width: this.state.screenWidth
                        }}
                        onPageSingleTap={() => {
                            this.setState({
                                isShowPdfView: !this.state.isShowPdfView
                            })
                        }}
                        fitPolicy={0}
                    // enablePaging
                    />
                </View>
                <DialogInput isDialogVisible={this.state.isDialogVisible}
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