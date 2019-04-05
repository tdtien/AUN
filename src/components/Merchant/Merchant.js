import React, { Component } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
    TouchableOpacity,
    Text,
    BackHandler,
    RefreshControl,
    ListView
} from "react-native";
import {
    Item,
    Icon as IconNB,
    Input,
    Container,
    Header,
    Content,
    List,
    Button,
    ListItem
} from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome'
import MerchantItem from "./MerchantItem";
import { Actions } from "react-native-router-flux";
import { merchantStyles } from "./MerchantStyle";
import RNFS from "react-native-fs";
import { AppCommon } from "../../commons/commons";
import CameraButton from "./CameraButton";
import { deleteItem } from '../../commons/utilitiesFunction'
import Loader from '../Loader/Loader';

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
            isSearching: false,
            version: 0
        };
    }
    componentDidMount() {
        // console.log('componentDidMount');
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.makeRemoteRequest();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ version: nextProps.version })
        this.makeRemoteRequest();
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

    // renderItem({ item }) {
    //     return (
    //         <MerchantItem
    //             item={item}
    //             action={this.handleDeleteItem}
    //             version={this.state.version}
    //         />
    //     );
    // }

    handleDeleteItem = (item, secId, rowId, rowMap) => {
        Alert.alert(
            'Delete folder',
            'Are you sure you want to delete this folder',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => null,
                },
                {
                    text: 'OK',
                    onPress: () => {
                        this.setState({
                            isLoading: true
                        })
                        rowMap[`${secId}${rowId}`].props.closeRow();
                        deleteItem(`file://${item.path}`).then(result => {
                            let temp = this.state.data;
                            temp.splice(temp.indexOf(item), 1);
                            this.setState({
                                data: temp,
                                isLoading: false
                            })
                            // this.makeRemoteRequest();
                        }).catch(error => {
                            this.setState({
                                isLoading: false
                            })
                            Alert.alert('Error', error.message);
                        })
                    },
                }
            ]
        )
    }

    handleSearch = () => {
        //
    };

    handleCancelSearch = () => {
        this.setState({ isSearching: false, data: [] }, () => this.handleRefresh());
    };

    render() {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        return (
            <Container style={{ backgroundColor: '#F7F5F5' }}>
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
                <Content
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                        />
                    }
                >
                    <List
                        rightOpenValue={-75}
                        dataSource={ds.cloneWithRows(this.state.data)}
                        renderRow={item => (
                            <MerchantItem
                                item={item}
                                version={this.state.version}
                            />
                        )}
                        renderRightHiddenRow={(item, secId, rowId, rowMap) => (
                            <Button full danger onPress={() => this.handleDeleteItem(item, secId, rowId, rowMap)}>
                                <Icon active name="trash" size = {25}/>
                            </Button>
                        )}
                    />
                    {/* <FlatList
                        data={this.state.data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem.bind(this)}
                        ListFooterComponent={this.renderFooter}
                        onRefresh={this.handleRefresh}
                        refreshing={this.state.refreshing}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={50}
                    /> */}
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
        paddingLeft: 5,
        paddingRight: 15
    },
});