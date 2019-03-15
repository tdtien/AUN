import React, { Component } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert, Dimensions, ScrollView, TouchableOpacity
} from "react-native";
import {
    Header,
    Left,
    Body,
    Button,
    Title,
    Right,
} from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions } from "react-native-router-flux";
import MerchantDetailItem from "./MerchantDetailItem";
import { merchantStyles } from "./MerchantStyle";
import { AppCommon } from "../../commons/commons";
import RNFS from "react-native-fs";

function fileToBase64(uri) {
    console.log('uri: ' + uri);
    return new Promise((resolve, reject) => {
        RNFS.readFile(uri, 'base64').then((response) => {
            // console.log('response: ' + response);
            resolve(response);
        }).catch((error) => {
            console.log('error: ' + error);
            reject(error);
        })
    })

}

async function folderToBase64(files: Array) {
    var array = [];
    for (let item of files) {
        await fileToBase64(`file://${item.path}`)
            .then(result => {
                // console.log('Result: ' + result);
                array.push(result);
            }).catch(error => {
                console.log('Error: ' + error);
                reject(error);
            })
    }
    console.log('Array: ' + array);
    return array;
}


export default class MerchantDetail extends Component {
    constructor(props) {
        super(props);
        console.log('Path: ' + this.props.folderPath);
        this.state = {
            data: [],
            columns: 2,
            isLoading: false,
            refreshing: false,
            byteArray: {}
        }
    }

    componentDidMount() {
        this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
        let path = this.props.folderPath;
        RNFS.readDir(path)
            .then((result) => {
                const files = [];
                if (result != undefined && result.length > 0) {
                    for (index in result) {
                        const item = result[index];
                        if (item.isFile()) {
                            files.push(item);
                        }
                    }
                    if (files.length > 0) {
                        this.setState({
                            data: files,
                            isLoading: false,
                            refreshing: false,
                        })
                    }
                    else {
                        this.setState({
                            data: [],
                            isLoading: false,
                            refreshing: false,
                        })
                    }
                }
                else {
                    this.setState({
                        data: [],
                        isLoading: false,
                        refreshing: false,
                    })
                }
            })
            .catch(err => {
                console.log('err in reading files');
                console.log(err);
                this.setState({
                    data: [],
                    isLoading: false,
                    refreshing: false,
                })
            })
    };

    handleRefresh = () => {
        this.setState(
            {
                refreshing: true
            },
            () => {
                this.makeRemoteRequest();
            }
        );
    };

    renderItem({ item }) {
        return (
            <MerchantDetailItem
                item={item}
                columns={this.state.columns}
            />
        );
    }

    handleExport2Pdf = () => {
        let x = [];
        folderToBase64(this.state.data)
            .then(result => {
                console.log('Array: ' + result);
                fetch('https://aun-api.herokuapp.com/user/convert2Pdf3', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTI3MjQyMjQsImVtYWlsIjoiMTUxMjY1NUBzdHVkZW50LmhjbXVzLmVkdS52biJ9.tCP20OKFMw4je3rBrMuPd9suG9-c77eSeodWtSyuNA4'
                    },
                    body: JSON.stringify(result)
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log('Export to pdf');
                        this.setState({
                            byteArray: responseJson.dataBase64
                        })
                        let folderPath = RNFS.ExternalDirectoryPath + AppCommon.pdf_dir;
                        // let filePath = folderPath + "/" + this.props.folderName + ".pdf";
                        let fileName = 'file.pdf';
                        let filePath = folderPath + "/" + fileName;
                        RNFS.exists(folderPath).then((response) => {
                            if (!response) {
                                RNFS.mkdir(folderPath).then((response) => {
                                    RNFS.writeFile(filePath, this.state.byteArray, "base64")
                                        .then(function (response) {
                                            console.log('Pdf is saved');
                                            Actions.pdfViewer({ filePath: `file://${filePath}`, fileName: fileName });
                                        }).catch(function (error) {
                                            console.log(error);
                                        })
                                })
                            } else {
                                RNFS.writeFile(filePath, this.state.byteArray, "base64")
                                    .then(function (response) {
                                        console.log('Pdf is saved');
                                        Actions.pdfViewer({ filePath: `file://${filePath}`, fileName: fileName });
                                    }).catch(function (error) {
                                        console.log(error);
                                    })
                            }
                        })
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }).catch(error => {
                console.log('Error when convert to pdf: ' + error);
                Alert.alert('Error', 'Error when convert to pdf');
            })
    }

    render() {
        return (
            <View style={{ borderTopWidth: 0, borderBottomWidth: 0, flex: 1, backgroundColor: '#F7F5F5' }}>
                <Header
                    androidStatusBarColor="#2196F3"
                    style={{ backgroundColor: "#2196F3" }}
                    hasTabs
                >
                    <TouchableOpacity style={styles.headerButton} onPress={() => Actions.pop()} >
                        <Icon
                            name='chevron-left'
                            size={25}
                            color='white'
                        />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center" }}>{this.props.folderName}</Title>
                    </Body>
                    <TouchableOpacity style={styles.headerButton} onPress={() => this.handleExport2Pdf()} >
                        <Icon
                            name='file-pdf-o'
                            size={30}
                            color='white'
                        />
                    </TouchableOpacity>
                </Header>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem.bind(this)}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    numColumns={this.state.columns}
                />
                <TouchableOpacity style={merchantStyles.cameraButton} onPress={() => { Actions.camera({ directory: this.props.folderPath }) }}>
                    <Icon name={"camera"}
                        size={25}
                        color="white" />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 10
    }
});
