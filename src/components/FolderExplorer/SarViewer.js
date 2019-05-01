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
import { createDirectoryTreeWith } from '../../commons/utilitiesFunction';

class SarViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            data: null,
            isShowFooter: false,
            choosenSarItem: {},
            isConnected: true
        };
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
        this._getAll();
    }


    _handleConnectivityChange = (isConnected) => {
        this.setState({ isConnected: isConnected })
    };

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange
        );
    }

    detail(item) {
        let props = {
            sarInfo: item,
            isConnected: this.state.isConnected,
            offlineSarInfo: this.state.data
        }
        Actions.criterionViewer(props);
    }

    _getAll = () => {
        NetInfo.isConnected.fetch().done((isConnected) => {
            this.setState({ isConnected: isConnected })
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
                Alert.alert('Nofication', 'Network request fail. Do you want to view offline ?',
                    [
                        {
                            text: 'No',
                            style: 'cancel',
                            onPress: () => null,
                        },
                        {
                            text: 'Yes', onPress: () => {
                                this.setState({
                                    data: this.props.directoryInfo[this.props.email],
                                })
                            }
                        }
                    ]
                );

            }
        });
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
                this.setState({
                    isLoading: false,
                    refreshing: false,
                })
                let downloadFlow = {
                    sarInfo: this.state.choosenSarItem
                }
                let directoryTree = createDirectoryTreeWith(downloadFlow, responseJson.data, 'sar');
                // console.log('directoryTree: ' + JSON.stringify(directoryTree));
                var directoryInfo = {
                    email: this.props.email,
                    directoryTree: directoryTree,
                    downloadItemType: 'sar',
                    downloadFlow: downloadFlow
                }
                this.props.setDirectoryInfo(directoryInfo);
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                })
                console.error('Error when download: ' + error);
            });
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
            </Container>
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

const styles = StyleSheet.create({
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
});