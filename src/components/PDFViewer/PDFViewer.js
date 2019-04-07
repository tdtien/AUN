import React from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Alert } from 'react-native';
import {
    Header,
    Left,
    Body,
    Button,
    Title,
    Right,
} from "native-base";
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';
import Loader from '../Loader/Loader'
import { updatePdf } from '../../api/accountApi';

class PDFViewer extends React.Component {
    constructor(props) {
        super(props);
        console.log('File Path: ' + this.props.filePath);
        // console.log('Token in pdf: ' + this.props.token);
        this.state = {
            isLoading: false
        }
    }

    handleUploadPdf = () => {
        this.setState({
            isLoading: true
        })
        var data = new FormData();
        data.append('file', {
            uri: this.props.filePath,
            name: this.props.fileName,
            type: 'multipart/form-data'
        });
        updatePdf(this.props.token, data)
            .then((responseJson) => {
                this.setState({
                    isLoading: false
                })
                console.log(responseJson);
                if (responseJson.msg === 'Upload file successful')
                    Alert.alert('Success', responseJson.msg);
                else {
                    Alert.alert('Error', responseJson.msg);
                }
            })
            .catch((error) => {
                console.error(error);
                Alert.alert('Error', error);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    androidStatusBarColor="#2196F3"
                    style={{ backgroundColor: "#2196F3" }}
                    hasTabs
                >
                    <TouchableOpacity style={styles.headerButton} onPress={() => Actions.pop()} >
                        <Icon name="arrow-left" size={30} color="#fff" />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center" }}>{this.props.fileName}</Title>
                    </Body>
                    <TouchableOpacity style={styles.headerButton} onPress={() => this.handleUploadPdf()} >
                        <Icon
                            name='upload'
                            size={30}
                            color='white'
                        />
                    </TouchableOpacity>
                </Header>
                <Pdf
                    source={{ uri: this.props.filePath }}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    style={styles.pdf}
                />
                {
                    <Loader loading={this.state.isLoading} />
                }
            </View>
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
        borderTopWidth: 0,
        borderBottomWidth: 0,
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