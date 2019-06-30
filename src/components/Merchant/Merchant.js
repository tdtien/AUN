import { Button, Container, Content, Header, Icon, Input, Item, Body, Title } from "native-base";
import React, { Component } from "react";
import { ActivityIndicator, Alert, BackHandler, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View, Platform } from "react-native";
import RNFS from "react-native-fs";
import { Actions } from "react-native-router-flux";
import { AppCommon } from "../../commons/commons";
import { deleteItem, getTextsFromUploadFlow, } from '../../commons/utilitiesFunction';
import CameraButton from "./CameraButton";
import MerchantItem from "./MerchantItem";
import moment from 'moment'
import Loader from '../Loader/Loader';
import BreadCrumb from "../Breadcrumb/Breadcrumb";
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';

export default class Merchant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: [],
            error: null,
            refreshing: false,
            searchText: "",
            isEnd: false,
            isSearching: false,
            version: Math.random(),
            dataFilter: []
        };
    }
    componentDidMount() {
        this.makeRemoteRequest();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('version')) {
            this.setState({ version: nextProps.version })
        }
        this.makeRemoteRequest();
    }

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

    renderFooter = () => {
        if (!this.state.isLoading) return null;
        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large" />
            </View>
        );
    };

    makeRemoteRequest = () => {
        let mainPath = AppCommon.directoryPath + AppCommon.root_dir;
        RNFS.exists(mainPath).then((response) => {
            if (!response) {
                RNFS.mkdir(mainPath).then((response) => {
                    this.setState({
                        data: [],
                        isLoading: false,
                        refreshing: false,
                    })
                })
            } else {
                RNFS.readDir(mainPath)
                    .then((result) => {
                        const folders = [];
                        if (result != undefined && result.length > 0) {
                            for (index in result) {
                                const item = result[index];
                                const files = [];
                                if (item.isDirectory()) {
                                    // console.log('Index: ' + index);
                                    // console.log('Folder name: ' + item.name);
                                    folders.unshift(item);
                                }
                            }
                            // console.log('Folder length: ' +folders.length);
                            if (folders.length > 0) {
                                this.setState({
                                    data: folders,
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
            }
        })

    };

    renderItem({ item }) {
        return (
            <MerchantItem
                item={item}
                action={this.handleDeleteItem}
                version={this.state.version}
                flow={this.props.flow}
            />
        );
    }

    handleSearch = (searchText) => {
        var temp = [];
        if (searchText) {
            this.state.data.forEach(function (element) {
                if (element.name.includes(searchText)) {
                    temp.push(element);
                }
            });
            this.setState({ dataFilter: temp });
        }
    };

    handleSearchPressed = () => {
        this.setState({
            isSearching: true
        })
    }

    handleSearchBack = () => {
        this.setState({
            isSearching: false,
            searchText: ""
        })
    }

    handleDeleteItem = (item) => {
        this.setState({
            isLoading: true
        })
        deleteItem(`file://${item.path}`).then(result => {
            let temp = this.state.data;
            temp.splice(temp.indexOf(item), 1);
            this.setState({
                data: temp,
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
            Alert.alert(I18n.t(keys.Common.lblError), error.message);
        })
    }

    handlePopTo = (index, isRoot = false) => {
        let sceneKey = '';
        if (isRoot) {
            sceneKey = '_sarExplorer';
        } else {
            sceneKey = AppCommon.uploadFlow[index].scene;
        }
        Actions.popTo(sceneKey);
    }

    render() {
        let uploadFlow = getTextsFromUploadFlow();
        let dataRender = this.state.searchText ? this.state.dataFilter : this.state.data;
        let header = (!this.state.isSearching) ? (
            <Header
                androidStatusBarColor={AppCommon.colors}
                iosBarStyle="light-content"
                style={{ backgroundColor: AppCommon.colors }}
                rounded
            >
                <TouchableOpacity style={styles.menuButton} onPress={() => Actions.pop()} >
                    <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                </TouchableOpacity>
                <Body style={{ flex: 1 }}>
                    <Title style={{ alignSelf: "center", color: 'white' }}>{I18n.t(keys.Merchant.Main.lblTitle)}</Title>
                </Body>
                <TouchableOpacity style={styles.menuButton} onPress={() => this.handleSearchPressed()} >
                    <Icon name={AppCommon.icon("search")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                </TouchableOpacity>
            </Header>
        ) : (
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                    searchBar
                    rounded
                >
                    <TouchableOpacity style={styles.menuButton} onPress={() => this.handleSearchBack()} >
                        <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                    <Item >
                        <Icon name={AppCommon.icon("search")} style={{ color: 'gray', fontSize: AppCommon.icon_size }} />
                        <Input
                            placeholder={I18n.t(keys.Merchant.Main.lblSearchPlaceholder)}
                            onChangeText={searchText => {
                                this.setState({ searchText: searchText });
                                this.handleSearch(searchText);
                            }}
                            onSubmitEditing={() => this.handleSearch(this.state.searchText)}
                            returnKeyType="search"
                            clearButtonMode="unless-editing"
                            clearTextOnFocus
                            style={{paddingVertical: 0}}
                        />
                    </Item>
                </Header>
            )
        return (
            <Container style={{ backgroundColor: '#F7F5F5' }}>
                {header}
                <BreadCrumb
                    isConnected={false}
                    handlePress={this.handlePopTo}
                    previousItem={[]}
                    currentItem={uploadFlow[0]}
                    nextItem={uploadFlow.slice(1, uploadFlow.length)}
                />
                <Content
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                >
                    {this.state.isLoading ? (
                        <ActivityIndicator
                            animating
                            color={AppCommon.colors}
                        />
                    ) : (
                            <FlatList
                                data={dataRender}
                                extraData={dataRender}
                                keyExtractor={(item, index) => moment(item.mtime).valueOf().toString()}
                                renderItem={this.renderItem.bind(this)}
                                ListFooterComponent={this.renderFooter}
                                onRefresh={this.handleRefresh}
                                refreshing={this.state.refreshing}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={50}
                            />
                        )}
                </Content>
                <CameraButton
                    folderPath={null}
                />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
});