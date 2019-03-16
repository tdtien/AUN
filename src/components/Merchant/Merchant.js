import React, { Component } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
    TouchableOpacity,
    Text,
    BackHandler
} from "react-native";
import { Item, Icon as IconNB, Input, Header } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome'
import MerchantItem from "./MerchantItem";
import { Actions } from "react-native-router-flux";
import { merchantStyles } from "./MerchantStyle";
import RNFS from "react-native-fs";
import { AppCommon } from "../../commons/commons";

export default class Merchant extends Component {
    constructor(props) {
        super(props);
        // console.log('Token in merchant: ' + this.props.token);
        this.state = {
            isLoading: true,
            data: [],
            error: null,
            refreshing: false,
            isEnd: false,
            searchText: "",
            isSearching: false
        };
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.makeRemoteRequest();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        if (Actions.currentScene === '_merchant')
            return true;
        return false;
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
    handleLoadMore = () => {
        //
    };

    componentWillUpdate() {
        this.makeRemoteRequest();
    }

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
        let mainPath = RNFS.ExternalDirectoryPath + AppCommon.root_dir;

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
                                folders.push(item);
                            }
                        }
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
            <MerchantItem item={item}>
            </MerchantItem>
        );
    }

    handleSearch = () => {
        //
    };

    handleCancelSearch = () => {
        this.setState({ isSearching: false, data: [] }, () => this.handleRefresh());
    };

    render() {
        return (
            <View style={{ borderTopWidth: 0, borderBottomWidth: 0, flex: 1, backgroundColor: '#F7F5F5' }}>
                <Header
                    androidStatusBarColor="#2196F3"
                    style={{ backgroundColor: "#2196F3" }}
                    searchBar
                    rounded
                >
                    <TouchableOpacity style={styles.menuButton} onPress={() => Actions.drawerOpen()} >
                        <IconNB name='menu' style={{ color: 'white' }} />
                    </TouchableOpacity>
                    <Item>
                        {this.state.isSearching ? <IconNB name="ios-arrow-back" onPress={() => this.handleCancelSearch()} /> : <IconNB name="ios-search" />}
                        <Input
                            placeholder="Search"
                            onChangeText={searchText =>
                                this.setState({ searchText: searchText })
                            }
                            onSubmitEditing={this.handleSearch}
                            returnKeyType="search"
                            clearButtonMode="unless-editing"
                            clearTextOnFocus
                            ref="searchInput"
                        />
                    </Item>
                </Header>
                <FlatList
                        data={this.state.data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem.bind(this)}
                        ListFooterComponent={this.renderFooter}
                        onRefresh={this.handleRefresh}
                        refreshing={this.state.refreshing}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={50}
                    />
                <TouchableOpacity style={merchantStyles.cameraButton} onPress={() => { Actions.camera({ directory: null }) }}>
                    <Icon name={"camera"}
                        size={30}
                        color="white" />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 15
    },
});