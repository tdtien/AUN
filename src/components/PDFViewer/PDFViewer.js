import React from 'react';
import { StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, Alert, View } from 'react-native';
import {
    Header,
    Body,
    Title,
    Container,
    Icon,
    Content
} from "native-base";
import Pdf from 'react-native-pdf';
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';
import Loader from '../Loader/Loader'
import { updatePdf } from '../../api/accountApi';
import { AppCommon } from '../../commons/commons';

class PDFViewer extends React.Component {
    constructor(props) {
        super(props);
        console.log('File Path: ' + this.props.filePath);
        this.state = {
            isLoading: false
        }
    }

    handleUploadPdf = () => {
        this.setState({
            isLoading: true
        })
        var data = {
            file: this.props.base64,
            sarId: 1,
            criterionId: 1,
            subCriterionId: 1,
            suggestionId: 15,
            name: this.props.fileName
        }
        updatePdf(this.props.token, data)
            .then((responseJson) => {
                this.setState({
                    isLoading: false
                })
                console.log('responseJson: ' + responseJson.msg);
                if (responseJson.msg === 'Upload file successful')
                    Alert.alert('Success', responseJson.msg);
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

    render() {
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
                        <Title style={{ alignSelf: "center", color: "white" }}>{this.props.fileName}</Title>
                    </Body>
                    <TouchableOpacity style={styles.headerButton} onPress={() => this.handleUploadPdf()} >
                        <Icon name={AppCommon.icon("cloud-upload")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                </Header>
                <View style={styles.container}>
                    <Pdf
                        onLoadProgress={() => {
                            <ActivityIndicator
                                animating
                                color={AppCommon.colors}
                            />
                        }}
                        source={{ uri: this.props.filePath }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        style={styles.pdf}
                        fitPolicy={0}
                        enablePaging
                    />
                </View>
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
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 10
    }
});