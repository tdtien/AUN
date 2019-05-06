import React, { Component } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    FlatList,
    View,
    Text,
    NetInfo,
    Alert
} from 'react-native';
import {
    Content,
    Container,
    Icon,
    Header,
    Body,
    Title,
} from 'native-base';
import { getAllSars, downloadSar } from '../../api/directoryTreeApi';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader'
import { Actions } from 'react-native-router-flux';
import { AppCommon } from '../../commons/commons';
import FolderItem from './FolderItem'
import { setDirectoryInfo } from "../../actions/directoryAction";
import DownloadButton from './DownloadButton';
import { createDirectoryTreeWith, downloadAllEvidences } from '../../commons/utilitiesFunction';
import {
    MenuContext,
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import NetworkMenuOption from './NetworkMenuOption';

class SarViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            refreshing: false,
            data: null,
            isShowFooter: false,
            choosenSarItem: {},
            // isConnected: true
            isNetworkConnected: true,
            isUserChooseConnect: true
        };
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange

        );

        NetInfo.isConnected.fetch().done((isConnected) => {
            this.setState({
                isNetworkConnected: isConnected,
            }, () => this._getAll());
        });
    }

    _handleConnectivityChange = (isConnected) => {
        this.setState({
            isNetworkConnected: isConnected
        })
    };

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
    }

    detail(item) {
        console.log('this.state.isNetworkConnected: ' + this.state.isNetworkConnected);
        console.log('this.state.isUserChooseConnect: ' + this.state.isUserChooseConnect);
        if (this.state.isNetworkConnected == false && this.state.isUserChooseConnect == true) {
            Alert.alert('Nofication', 'Network request fail. Do you want to view offline ?',
                [
                    {
                        text: 'No',
                        style: 'cancel',
                        onPress: () => null
                    },
                    {
                        text: 'Yes', onPress: () => {
                            let downloadData = (Object.keys(this.props.directoryInfo).length === 0) ? [] : this.props.directoryInfo[this.props.email];
                            // console.log('downloadData: ' + JSON.stringify(downloadData));
                            this.setState({
                                data: downloadData,
                                isUserChooseConnect: false
                            })
                        }
                    }
                ]
            );
        } else {
            let props = {
                sarInfo: item,
                isConnected: this.state.isNetworkConnected && this.state.isUserChooseConnect,
                offlineSarInfo: this.state.data
            }
            Actions.criterionViewer(props);
        }
    }

    _getAll = () => {
        this.setState({
            isLoading: true,
        })
        let isConnected = this.state.isNetworkConnected && this.state.isUserChooseConnect;
        if (isConnected === true) {
            getAllSars(this.props.token)
                .then((responseJson) => {
                    // console.log('responseJson sar: ' + JSON.stringify(responseJson.data));
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                        data: responseJson.data
                    })
                })
                .catch((error) => {
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                    })
                    console.error('Error: ' + error);
                });
        }
        else {
            this.setState({
                isLoading: false,
                refreshing: false,
            })
            let notification = (this.state.isNetworkConnected) ? 'The network is connected. Do you want to view offline ?' : 'Network request fail. Do you want to view offline ?';
            Alert.alert('Nofication', notification,
                [
                    {
                        text: 'No',
                        style: 'cancel',
                        onPress: () => {
                            this.setState({
                                isUserChooseConnect: true
                            }, () => { (this.state.isNetworkConnected) ? this._getAll() : null })
                        }
                    },
                    {
                        text: 'Yes', onPress: () => {
                            let downloadData = (Object.keys(this.props.directoryInfo).length === 0) ? [] : this.props.directoryInfo[this.props.email];
                            // console.log('downloadData: ' + JSON.stringify(downloadData));
                            this.setState({
                                data: downloadData,
                                isUserChooseConnect: false
                            })
                        }
                    }
                ]
            );
            console.log()
        }
    }

    handleRefresh = () => {
        this.setState(
            {
                refreshing: true,
                isShowFooter: false
            },
            () => {
                this._getAll();
            }
        );
    };

    renderItem({ item }) {
        return (
            <FolderItem
                item={item}
                parentView={this}
            />
        )
    }

    handleShowFooter = (choosenSarItem) => {
        this.setState({
            isShowFooter: true,
            choosenSarItem: choosenSarItem
        })
    }

    handleDownloadItem = () => {
        this.setState({
            isLoading: true,
        })
        downloadSar(this.props.token, this.state.choosenSarItem.id)
            .then((responseJson) => {
                let downloadFlow = {
                    sarInfo: this.state.choosenSarItem
                }
                let directoryTree = createDirectoryTreeWith(downloadFlow, responseJson.data, 'sar');
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
                            downloadItemType: 'sar',
                            downloadFlow: downloadFlow
                        }
                        this.props.setDirectoryInfo(directoryInfo);
                    }).catch(error => {
                        this.setState({
                            isLoading: false,
                            refreshing: false,
                            isShowFooter: false
                        })
                        console.log('Error when download: ' + error);
                    })
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                })
                console.error('Error when download: ' + error);
            });
    }

    handleNetworkConnection = (isConnected) => {
        console.log('user choose: ' + isConnected);
        if (isConnected !== this.state.isUserChooseConnect) {
            this.setState({
                isUserChooseConnect: isConnected,
            }, () => this._getAll())
        }
    }

    render() {
        let leftHeaderButton = (this.state.isShowFooter) ? (
            <TouchableOpacity style={styles.menuButton} onPress={() => {
                this.setState({
                    isShowFooter: false
                })
                Actions.pop()
            }} >
                <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
            </TouchableOpacity>
        ) : (
                <TouchableOpacity style={styles.menuButton} onPress={() => Actions.drawerOpen()} >
                    <Icon name={AppCommon.icon("menu")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                </TouchableOpacity>
            )
        let footer = (this.state.isShowFooter) ?
            (
                <DownloadButton
                    parentView={this}
                />
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
                        <Title style={{ alignSelf: "center", color: 'white' }}>All Sars</Title>
                    </Body>
                    <NetworkMenuOption
                        parentView={this}
                    />
                </Header>
                <Content
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                >
                    {
                        (this.state.data !== null && this.state.data.length === 0) ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#BDBDBD' }}>There is no content.</Text>
                                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => this.handleRefresh()}>
                                    <Text style={{ color: '#BDBDBD', textDecorationLine: 'underline' }}>Click here to reload</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                                <FlatList
                                    data={this.state.data}
                                    extraData={this.state}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={this.renderItem.bind(this)}
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
                <Loader loading={this.state.isLoading} />
            </Container >
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setDirectoryInfo: item => {
            dispatch(setDirectoryInfo(item));
        }
    };
};

const mapStateToProps = state => {
    return {
        token: state.account.token,
        email: state.account.email,
        directoryInfo: state.directory.directoryInfo
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SarViewer);

const triggerStyles = {
    triggerWrapper: {
        padding: 10,
    },
    TriggerTouchableComponent: TouchableOpacity,
};

const styles = StyleSheet.create({
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
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