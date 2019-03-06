import React, { Component } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Item, Icon as IconNB, Input, Header } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome'
import MerchantItem from "./MerchantItem";
import { Actions } from "react-native-router-flux";
import { merchantStyles } from "./MerchantStyle";

let merchantList = [
    {
        "key": "1",
        "count": 2,
        "imageList": [
            {
                "key": "image1",
                "image": require("../../assets/imgTest/imageTest1.jpg"),
                "name": "Image Test 1",
                "date": "01/03/2019",
                "time": "16:41"
            },
            {
                "key": "image2",
                "image": require("../../assets/imgTest/imageTest2.jpg"),
                "name": "Image Test 2",
                "date": "02/03/2019",
                "time": "16:42"
            },
        ]
    },
    {
        "key": "2",
        "count": 1,
        "imageList": [
            {
                "key": "image3",
                "image": require("../../assets/imgTest/imageTest3.jpg"),
                "name": "Image Test 3",
                "date": "03/03/2019",
                "time": "16:43"
            }
        ]
    },
];

export default class Merchant extends Component {
    constructor(props) {
        super(props);
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
    handleLoadMore = () => {
        //
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
        this.setState({
            data: merchantList,
            isLoading: false,
            refreshing: false,
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
                <ScrollView>
                    <FlatList
                        data={this.state.data}
                        renderItem={this.renderItem.bind(this)}
                        ListFooterComponent={this.renderFooter}
                        onRefresh={this.handleRefresh}
                        refreshing={this.state.refreshing}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={50}
                    />
                </ScrollView>
                <TouchableOpacity style={merchantStyles.cameraButton} onPress={() => { Actions.camera() }}>
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
