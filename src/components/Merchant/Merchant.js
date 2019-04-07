import { Button, Container, Content, Header, Icon as IconNB, Input, Item, List, Body, Title } from "native-base";
import React, { Component } from "react";
import { ActivityIndicator, Alert, Text, BackHandler, ListView, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import RNFS from "react-native-fs";
import { Actions } from "react-native-router-flux";
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppCommon } from "../../commons/commons";
import { deleteItem } from '../../commons/utilitiesFunction';
import CameraButton from "./CameraButton";
import MerchantItem from "./MerchantItem";

const searchHeight = 40;
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
        // console.log('componentDidMount');
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        this.makeRemoteRequest();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('version')) {
            this.setState({ version: nextProps.version })
        }
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

    handleSearch = (searchText) => {
        console.log(searchText);
        temp = [];
        if (searchText) {
            this.state.data.forEach(function (element) {
                if (element.name.includes(searchText)) {
                    temp.push(element);
                }
            });
            this.setState({ dataFilter: temp });
        }
    };

    handleCancelSearch = () => {
        this.setState({ isSearching: false, data: [] }, () => this.handleRefresh());
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

    render() {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        let dataRender = this.state.searchText ? this.state.dataFilter : this.state.data;
        let header = (!this.state.isSearching) ? (
            <Header
                androidStatusBarColor="#2196F3"
                style={{ backgroundColor: "#2196F3" }}
                rounded
            >
                <TouchableOpacity style={styles.menuButton} onPress={() => Actions.drawerOpen()} >
                    <IconNB name='menu' style={{ color: 'white' }} />
                </TouchableOpacity>
                <Body style={{ flex: 1 }}>
                    <Title style={{ alignSelf: "center"}}>All Docs</Title>
                </Body>
                <TouchableOpacity style={styles.menuButton} onPress={() => this.handleSearchPressed()} >
                    <IconNB name="ios-search" style={{ color: 'white' }} />
                </TouchableOpacity>
            </Header>
        ) : (
                <Header
                    androidStatusBarColor="#2196F3"
                    style={{ backgroundColor: "#2196F3" }}
                    searchBar
                    rounded
                >
                    <TouchableOpacity style={styles.menuButton} onPress={() => this.handleSearchBack()} >
                        <IconNB name='ios-arrow-back' style={{ color: 'white' }} />
                    </TouchableOpacity>
                    <Item >
                        <IconNB name="ios-search" />
                        <Input
                            placeholder="Search..."
                            onChangeText={searchText => {
                                this.setState({ searchText: searchText }),
                                    this.handleSearch(searchText);
                            }
                            }
                            onSubmitEditing={this.handleSearch}
                            returnKeyType="search"
                            clearButtonMode="unless-editing"
                            clearTextOnFocus
                        />
                    </Item>

                </Header>
            )
        return (
            <Container style={{ backgroundColor: '#F7F5F5' }}>
                {
                    header
                }
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
                        dataSource={ds.cloneWithRows(dataRender)}
                        renderRow={item => (
                            <MerchantItem
                                item={item}
                                version={this.state.version}
                            />
                        )}
                        renderRightHiddenRow={(item, secId, rowId, rowMap) => (
                            <Button full danger onPress={() => this.handleDeleteItem(item, secId, rowId, rowMap)}>
                                <Icon active name="trash" size={25} />
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
        paddingLeft: 10,
        paddingRight: 10
    },
});