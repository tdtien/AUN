import React, { Component } from "react";
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
    Alert
} from 'react-native';
import SortableList from 'react-native-sortable-list';
import { Container, Title, Body, Icon, Header, Content } from "native-base";
import { AppCommon } from "../../commons/commons";
import { Actions } from "react-native-router-flux";
import Loader from "../Loader/Loader";
import { connect } from 'react-redux'
import { folderToBase64 } from "../../commons/utilitiesFunction";
import { convert2Pdf } from "../../api/accountApi";
import RNFS from "react-native-fs";
import BreadCrumb from "../Breadcrumb/Breadcrumb";

const window = Dimensions.get('window');
const imageWidth = (window.width - 30 * 2)
const imageHeight = imageWidth * 0.5;

class SortList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            byteArray: {},
            data: this.props.data,
            orderKey: []
        }
    }

    render() {
        return (
            <Container>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                >
                    <TouchableOpacity style={styles.headerButton} onPress={() => Actions.pop()} >
                        <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center", marginRight: 15, color: 'white' }}>Sort image to export PDF</Title>
                    </Body>
                    <TouchableOpacity style={styles.headerButton} onPress={() => this.handleExport2Pdf()} >
                        <Icon name="pdffile1" type="AntDesign" style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                </Header>
                <BreadCrumb
                    isConnected={false}
                    handlePress={this.handlePopTo}
                    previousItem={AppCommon.uploadFlow.slice(0, 2)}
                    currentItem={AppCommon.uploadFlow[2]}
                    nextItem={AppCommon.uploadFlow.slice(3,AppCommon.uploadFlow.length)}
                />
                <SortableList
                    style={styles.list}
                    contentContainerStyle={styles.contentContainer}
                    data={this.state.data}
                    renderRow={this._renderRow.bind(this)}
                    onChangeOrder={(nextOrder) => { this.setState({ orderKey: nextOrder }) }}
                />
                <Loader loading={this.state.isLoading} />
            </Container>
        );
    }

    handleExport2Pdf = () => {
        this.setState({ isLoading: true })
        var exportData = [];
        if (this.state.orderKey.length == 0) {
            for (key in this.state.data) {
                if (this.state.data.hasOwnProperty(key)) {
                    const element = this.state.data[key];
                    exportData.push(element.item);
                }
            }
        } else {
            for (var i = 0; i < this.state.orderKey.length; i++) {
                const element = this.state.data[parseInt(this.state.orderKey[i])];
                exportData.push(element.item);
            }
        }
        folderToBase64(exportData)
            .then(result => {
                convert2Pdf(this.props.token, result)
                    .then((responseJson) => {
                        this.setState({ isLoading: false })
                        if (responseJson.hasOwnProperty('dataBase64')) {
                            let props = {
                                imageFolderPath: this.props.folderPath,
                                fileName: this.props.folderName,
                                base64: responseJson.dataBase64,
                                flow: this.props.flow
                            };
                            Actions.pdfViewer(props);
                        } else {
                            Alert.alert('Error', 'Cannot conver to pdf. Please contact developer to fix this issue');
                        }
                    })
                    .catch((error) => {
                        this.setState({ isLoading: false })
                        console.error(error);
                    });
            }).catch(error => {
                this.setState({ isLoading: false })
                console.log('Error when convert to pdf: ' + error);
                Alert.alert('Error', 'Error when convert to pdf');
            })
    }

    _renderRow = ({ data, active }) => {
        return <Row data={data} active={active} />
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
}

class Row extends Component {

    constructor(props) {
        super(props);

        this._active = new Animated.Value(0);

        this._style = {
            ...Platform.select({
                ios: {
                    transform: [{
                        scale: this._active.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.1],
                        }),
                    }],
                    shadowRadius: this._active.interpolate({
                        inputRange: [0, 1],
                        outputRange: [2, 10],
                    }),
                },

                android: {
                    transform: [{
                        scale: this._active.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.07],
                        }),
                    }],
                    elevation: this._active.interpolate({
                        inputRange: [0, 1],
                        outputRange: [2, 6],
                    }),
                },
            })
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.active !== nextProps.active) {
            Animated.timing(this._active, {
                duration: 300,
                easing: Easing.bounce,
                toValue: Number(nextProps.active),
            }).start();
        }
    }

    render() {
        const { data, active } = this.props;

        return (
            <Animated.View style={[
                styles.row,
                this._style,
            ]}>
                <Image source={{ uri: data.image }} style={styles.image} />
            </Animated.View>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.account.token,
    };
};

export default connect(mapStateToProps)(SortList);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',

        ...Platform.select({
            ios: {
                paddingTop: 20,
            },
        }),
    },

    title: {
        fontSize: 20,
        paddingVertical: 20,
        color: '#999999',
    },

    list: {
        flex: 1,
    },

    contentContainer: {
        width: window.width,

        ...Platform.select({
            ios: {
                paddingHorizontal: 30,
            },

            android: {
                minHeight: window.height,
                paddingHorizontal: 0,
            }
        })
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 16,
        height: imageHeight,
        flex: 1,
        marginTop: 7,
        marginBottom: 12,
        borderRadius: 25,


        ...Platform.select({
            ios: {
                width: window.width - 30 * 2,
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowOpacity: 1,
                shadowOffset: { height: 2, width: 2 },
                shadowRadius: 2,
            },

            android: {
                width: window.width - 30 * 2,
                elevation: 0,
                marginHorizontal: 30,
            },
        })
    },

    image: {
        width: imageWidth,
        height: imageHeight,
        borderRadius: 25
    },

    text: {
        fontSize: 24,
        color: '#222222',
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
});