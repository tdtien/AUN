import React, { Component } from "react";
import { NetInfo, TouchableOpacity, StyleSheet, FlatList, Text, View } from "react-native";
import { connect } from 'react-redux';
import { AppCommon } from "../../commons/commons";
import { Header, Container, Content, Icon, Body, Title } from "native-base";
import Loader from "../Loader/Loader";
import { getAllCriterions, getAllSubCriterions, getAllSuggestions } from "../../api/directoryTreeApi";
import FolderItem from "../FolderExplorer/FolderItem";
import { Actions } from "react-native-router-flux";


class SarExplorer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            scene: [
                { key: 'criterions', title: 'All Criterions' },
                { key: 'subCriterions', title: 'All Subcriterions' },
                { key: 'suggestions', title: 'All Suggestions' }
            ],
            currentIdx: 0,
            data: [],
            isShowFooter: false,
            currentId: this.props.sarInfo.id,
            previousId: [],
        }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
        this.makeRemoteRequest(this.state.currentId);
    }

    handleConnectivityChange = (isConnected) => {
        this.setState({ isConnected: isConnected })
    };

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
    }

    makeRemoteRequest = (id) => {
        console.log(id);
        if (this.state.scene[this.state.currentIdx].key === 'criterions') {
            getAllCriterions(this.props.token, id)
                .then((responseJson) => {
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
        } else if (this.state.scene[this.state.currentIdx].key === 'subCriterions') {
            getAllSubCriterions(this.props.token, id)
                .then((responseJson) => {
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
        } else if (this.state.scene[this.state.currentIdx].key === 'suggestions') {
            getAllSuggestions(this.props.token, id)
                .then((responseJson) => {
                    console.log(responseJson.data);
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
        } else {
            this.setState({
                isLoading: false,
                refreshing: false,
            })
        }
    }

    handleRefresh = () => {
        this.setState({ refreshing: true }, this.makeRemoteRequest(this.state.currentId));
    };

    handlePop = () => {
        if (this.state.currentIdx > 0) {
            this.state.currentIdx--;
            let id = this.state.previousId.pop();
            this.setState({ isLoading: true, currentId: id }, this.makeRemoteRequest(id));
        } else {
            Actions.pop();
        }
    }

    handlePush = (item) => {
        console.log(item);
        this.state.currentIdx++;
        this.state.previousId.push(this.state.currentId);
        this.setState({ isLoading: true, currentId: item.id }, this.makeRemoteRequest(item.id));
    }

    renderItem = ({ item }) => {
        return (
            <FolderItem
                item={item}
                parentView={this}
            />
        )
    }

    render() {
        return (
            <Container style={{ backgroundColor: AppCommon.background_color }}>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                >
                    <TouchableOpacity style={styles.menuButton}
                        onPress={() => this.state.isShowFooter ?
                            this.setState({ isShowFooter: false })
                            :
                            this.handlePop()}
                    >
                        <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center", color: 'white' }}>{this.state.scene[this.state.currentIdx].title}</Title>
                    </Body>
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
                                    renderItem={this.renderItem}
                                    onRefresh={this.handleRefresh}
                                    refreshing={this.state.refreshing}
                                    onEndReached={this.handleLoadMore}
                                    onEndReachedThreshold={50}
                                />
                            )
                    }
                </Content>
                <Loader loading={this.state.isLoading} />
            </Container>
        )
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

const mapStateToProps = state => {
    return {
        token: state.account.token,
    };
};

export default connect(mapStateToProps)(SarExplorer);
