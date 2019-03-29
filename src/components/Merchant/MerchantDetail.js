import React, { Component } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert, Dimensions, ScrollView, TouchableOpacity, Text, Image
} from "react-native";
import {
    Header,
    Left,
    Body,
    Button,
    Title,
    Right,
} from "native-base";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Actions } from "react-native-router-flux";
import { merchantStyles } from "./MerchantStyle";
import { AppCommon } from "../../commons/commons";
import RNFS from "react-native-fs";
import { connect } from 'react-redux'
import { folderToBase64 } from "../../commons/utilitiesFunction";
import Loader from '../Loader/Loader'
import CameraButton from "./CameraButton";
import {
    MenuContext,
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from 'react-native-popup-menu';
import { CheckBox } from 'react-native-elements'

const screenWidth = Dimensions.get('window').width;
const columns = 2;
const imageMargin = 10;
const imageWidth = (screenWidth - imageMargin * 4) / columns;
const checkboxSize = imageWidth / 6;
class MerchantDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false,
            refreshing: false,
            byteArray: {},
            isCheckBoxVisible: false,
            selectedCheckList: [],
        }
    }

    componentDidMount() {
        this.makeRemoteRequest();
    }

    componentWillReceiveProps(nextProps) {
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

    handleImageModal = (item) => {
        folderToBase64(this.state.data).then(response => {
            var dataProps = [];
            for (var i = 0; i < this.state.data.length; i++) {
                let image = { url: `file://${this.state.data[i].path}`, base64: response[i] };
                dataProps.push(image);
            }
            console.log(dataProps);
            var props = { images: dataProps, index: this.state.data.indexOf(item), mode: "edit" };
            Actions.imageModal(props);
        }).catch(error => {
            console.log(error);
        })
    }

    handleSelectMultipleImages = () => {
        this.setState({
            isCheckBoxVisible: !this.state.isCheckBoxVisible,
            selectedCheckList: []
        })
    }


    handleCheckBoxPressed = (item) => {
        let tmp = this.state.selectedCheckList;
        if (tmp.includes(item)) {
            tmp.splice(tmp.indexOf(item), 1);
        } else {
            tmp.push(item);
        }
        this.setState({
            selectedCheckList: tmp
        });
    }

    renderItem({ item }) {
        let detailImageItem = (this.state.isCheckBoxVisible) ? (
            <TouchableOpacity style={styles.imageItem} onPress={() => this.handleCheckBoxPressed(item)}>
                <Image style={{ width: imageWidth, height: imageWidth * 1.4 }} source={{ isStatic: true, uri: `file://${item.path}` }} />
                <CheckBox
                    center
                    containerStyle={styles.checkbox}
                    checked={this.state.selectedCheckList.includes(item) ? true : false}
                    onPress={() => this.handleCheckBoxPressed(item)}
                    size={checkboxSize}
                    checkedColor={'white'}
                />
            </TouchableOpacity>
        ) : (
                <TouchableOpacity style={styles.imageItem} onPress={() => this.handleImageModal(item)}>
                    <Image style={{ width: imageWidth, height: imageWidth * 1.4 }} source={{ isStatic: true, uri: `file://${item.path}` }} />
                </TouchableOpacity>
            )
        return (
            <View>
                {
                    detailImageItem
                }
            </View>

        );
    }

    handleExport2Pdf = () => {
        this.setState({
            isLoading: true
        })
        let exportData = (this.state.isCheckBoxVisible) ? this.state.selectedCheckList : this.state.data;
        folderToBase64(exportData)
            .then(result => {
                console.log('Array: ' + result);
                fetch('https://aun-api.herokuapp.com/user/convert2Pdf3', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': this.props.token
                    },
                    body: JSON.stringify(result)
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log('Export to pdf');
                        this.setState({
                            byteArray: responseJson.dataBase64,
                            isLoading: false
                        })
                        let folderPath = RNFS.ExternalDirectoryPath + AppCommon.pdf_dir;
                        // let filePath = folderPath + "/" + this.props.folderName + ".pdf";
                        let fileName = this.props.folderName + ".pdf";
                        let filePath = folderPath + "/" + fileName;
                        RNFS.exists(folderPath).then((response) => {
                            if (!response) {
                                RNFS.mkdir(folderPath).then((response) => {
                                    RNFS.writeFile(filePath, this.state.byteArray, "base64")
                                        .then(function (response) {
                                            console.log('Pdf is saved');
                                            // Actions.pdfViewer({ filePath: `file://${filePath}`, fileName: fileName, token: this.props.token });
                                            Actions.pdfViewer({ filePath: `file://${filePath}`, fileName: fileName });
                                        }).catch(function (error) {
                                            console.log(error);
                                        })
                                })
                            } else {
                                RNFS.writeFile(filePath, this.state.byteArray, "base64")
                                    .then(function (response) {
                                        console.log('Pdf is saved');
                                        // Actions.pdfViewer({ filePath: `file://${filePath}`, fileName: fileName, token: this.props.token  });
                                        Actions.pdfViewer({ filePath: `file://${filePath}`, fileName: fileName });
                                    }).catch(function (error) {
                                        console.log(error);
                                    })
                            }
                        })
                    })
                    .catch((error) => {
                        this.setState({
                            isLoading: false
                        })
                        console.error(error);
                    });
            }).catch(error => {
                this.setState({
                    isLoading: false
                })
                console.log('Error when convert to pdf: ' + error);
                Alert.alert('Error', 'Error when convert to pdf');
            })
    }

    render() {
        let checkboxTitle = (!this.state.isCheckBoxVisible) ? 'Select' : 'Deselect'
        let exportButton = (this.state.isCheckBoxVisible && (this.state.selectedCheckList.length === 0)) ?
            (
                <TouchableOpacity disabled={true} style={styles.headerButton} onPress={() => this.handleExport2Pdf()} >
                    <Icon name="export" size={30} color="#B0C4DE" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.headerButton} onPress={() => this.handleExport2Pdf()} >
                    <Icon name="export" size={30} color="#fff" />
                </TouchableOpacity>
            )
        return (
            <View style={{ borderTopWidth: 0, borderBottomWidth: 0, flex: 1, backgroundColor: '#F7F5F5' }}>
                <Header
                    androidStatusBarColor="#2196F3"
                    style={{ backgroundColor: "#2196F3" }}
                    hasTabs
                >
                    <TouchableOpacity style={styles.headerButton} onPress={() => Actions.pop()} >
                        <Icon name="arrow-left" size={30} color="#fff" />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center" }}>{this.props.folderName}</Title>
                    </Body>
                    {
                        exportButton
                    }
                    <View style={styles.headerLastButton}>
                        <Menu>
                            <MenuTrigger>
                                <Icon name="dots-vertical" size={30} color="#fff" />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={() => this.handleSelectMultipleImages()}>
                                    <View style={styles.popupItem}>
                                        <Icon name="checkbox-marked" size={30} color="#2F4F4F" />
                                        <Text style={styles.popupItemText}>{checkboxTitle}</Text>
                                    </View>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                </Header>
                <FlatList
                    extraData={this.state}
                    data={this.state.data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem.bind(this)}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    numColumns={columns}
                />
                <CameraButton
                    folderPath={this.props.folderPath}
                />
                {
                    <Loader loading={this.state.isLoading} />
                }
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.account.token,
    };
};

export default connect(mapStateToProps)(MerchantDetail);

const styles = StyleSheet.create({
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 5
    },
    headerLastButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 0
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
    },
    checkbox: {
        position: 'absolute',
        right: -10,
        top: -5
    },
    imageItem: {
        flex: 1,
        flexDirection: 'row',
        position: 'relative',
        backgroundColor: "#F7F5F5",
        margin: 10,
    },
});
