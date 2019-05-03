import React, { Component } from "react";
import {
    NetInfo,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    View,
    ActivityIndicator,
    ScrollView,
    Dimensions
} from "react-native";
import { connect } from 'react-redux';
import { AppCommon } from "../../commons/commons";
import { Header, Container, Content, Icon, Body, Title, Text } from "native-base";
import { getAllCriterions, getAllSubCriterions, getAllSuggestions, getAllEvidences } from "../../api/directoryTreeApi";
import { Actions } from "react-native-router-flux";
import SuggestionItem from "../FolderExplorer/SuggestionItem";
import SarFolder from "./SarFolder";
import SarItem from "./SarItem";

const window = Dimensions.get('window');
class SarExplorer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isConnected: true,
            isLoading: true,
            refreshing: false,
            scene: [
                { key: 'criterions', title: 'All Criterions' },
                { key: 'subCriterions', title: 'All Subcriterions' },
                { key: 'suggestionTypes', title: 'All Suggestion Types' },
                { key: 'suggestions', title: 'All ' },
                { key: 'evidences', title: 'All Evidences' }
            ],
            currentIdx: 0,
            data: [],
            dataSuggestions: {},
            isShowFooter: false,
            currentItem: this.props.sarInfo,
            previousItem: [],
        }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
        this.makeRemoteRequest(this.state.currentItem.id);
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
        const { scene, currentIdx, dataSuggestions } = this.state;
        const { token } = this.props;
        if (scene[currentIdx].key === 'criterions') {
            getAllCriterions(token, id)
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
        } else if (scene[currentIdx].key === 'subCriterions') {
            getAllSubCriterions(token, id)
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
        } else if (scene[currentIdx].key === 'suggestionTypes') {
            getAllSuggestions(token, id)
                .then((responseJson) => {
                    let data = [
                        { id: 'implications', name: 'Implications' },
                        { id: 'questions', name: 'Questions' },
                        { id: 'evidences', name: 'Evidence Types' }
                    ]
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                        data: data,
                        dataSuggestions: responseJson.data
                    })
                })
                .catch((error) => {
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                    })
                    console.error('Error: ' + error);
                });
        } else if (scene[currentIdx].key === 'suggestions') {
            this.setState({
                isLoading: false,
                refreshing: false,
                data: dataSuggestions[id]
            })
        } else if (scene[currentIdx].key === 'evidences') {
            getAllEvidences(token, id)
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
        } else {
            this.setState({
                isLoading: false,
                refreshing: false,
            })
        }
    }

    handleRefresh = () => {
        this.setState({ refreshing: true }, () => this.makeRemoteRequest(this.state.currentItem.id));
    };

    handlePop = () => {
        if (this.state.currentIdx > 0) {
            this.state.currentIdx--;
            let item = this.state.previousItem.pop();
            this.setState({
                isLoading: true,
                currentItem: item
            }, () => this.makeRemoteRequest(item.id));
        } else {
            Actions.pop();
        }
    }

    handlePopTo = (index) => {
        if (index >= 0 && index < this.state.currentIdx) {
            let item = this.state.previousItem[index];
            this.state.currentIdx = index;
            this.state.previousItem.splice(index, this.state.previousItem.length - index)
            this.setState({
                isLoading: true,
                currentItem: item
            }, () => this.makeRemoteRequest(item.id));
        }
    }

    handlePush = (item) => {
        this.state.currentIdx++;
        this.state.previousItem.push(this.state.currentItem);
        this.setState({
            isLoading: true,
            currentItem: item
        }, () => this.makeRemoteRequest(item.id));

    }

    renderItem = ({ item }) => {
        let itemType = ['IMPLICATION', 'QUESTION', 'FILE']
        if (item.hasOwnProperty('type') && itemType.indexOf(item.type) >= 0) {
            return (<SarItem
                item={item}
                type={item.type}
            />)
        }
        return (
            <SarFolder
                item={item}
                type={this.state.currentItem.id}
                onPress={() => this.handlePush(item)}
            />
        )
    }

    render() {
        const { currentItem, scene, currentIdx } = this.state;
        let currentScene = scene[currentIdx]
        let title = currentScene.key === 'suggestions' ? currentScene.title + currentItem.name : currentScene.title
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
                        <Title style={{ alignSelf: "center", color: 'white' }}>{title}</Title>
                    </Body>
                </Header>
                <ScrollView
                    style={{ maxHeight: 40 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        if (contentWidth > window.width) {
                            this.scrollView.scrollToEnd({ animated: true });
                        } else {
                            this.scrollView.scrollTo({ x: 0, y: 0, animated: false });
                        }
                    }}
                >
                    <TouchableOpacity style={styles.menuButton} onPress={() => Actions.popTo('_sarViewer')}>
                        <Icon name={AppCommon.icon("tv")} type="Ionicons" style={{ color: 'gray', fontSize: 20 }} />
                    </TouchableOpacity>
                    {this.state.previousItem.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={item.id + index}
                                style={styles.breadCrumbItem}
                                onPress={() => this.handlePopTo(index)}
                            >
                                <Icon name="right" type="AntDesign" style={styles.crumbArrow} />
                                <Text style={styles.crumbItem}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                    <TouchableOpacity style={styles.breadCrumbItem} disabled>
                        <Icon name="right" type="AntDesign" style={styles.crumbArrow} />
                        <Text style={styles.activeCrumbItem}>
                            {currentItem.hasOwnProperty('type') && currentItem.type === 'EVIDENCE' ? currentItem.content : currentItem.name}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                <Content
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                >
                    {this.state.isLoading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" animating color={AppCommon.colors} />
                        </View>
                    ) : (
                            (this.state.data.length === 0) ? (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: '#BDBDBD' }}>There is no content</Text>
                                </View>
                            ) : (
                                    <FlatList
                                        data={this.state.data}
                                        extraData={this.state.data}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={this.renderItem}
                                        onRefresh={this.handleRefresh}
                                        refreshing={this.state.refreshing}
                                        onEndReached={this.handleLoadMore}
                                        onEndReachedThreshold={50}
                                    />
                                )
                        )}
                </Content>
                {/* <Loader loading={this.state.isLoading} /> */}
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
    breadCrumbItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    crumbItem: {
        color: 'gray'
    },
    activeCrumbItem: {
        color: AppCommon.colors,
        paddingRight: 10
    },
    crumbArrow: {
        color: 'gray',
        fontSize: 15
    }
});

const mapStateToProps = state => {
    return {
        token: state.account.token,
    };
};

export default connect(mapStateToProps)(SarExplorer);
