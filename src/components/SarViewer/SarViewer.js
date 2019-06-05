import { Body, Container, Content, Footer, Header, Icon, Right, Text, Title, Grid, Col, Row } from "native-base";
import React, { Component } from "react";
import { ActivityIndicator, Alert, Dimensions, ScrollView, NetInfo, StyleSheet, TouchableOpacity, View, Linking } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';
import { downloadCriterion, downloadSar, downloadSubCriterion, downloadSuggestion, getDataSar, getAllContentSar } from "../../api/directoryTreeApi";
import { createDirectoryTreeWith, downloadAllEvidences, isEmptyJson, _searchTree, getNextType, limitText, getRandomArbitrary } from "../../commons/utilitiesFunction";
import { AppCommon } from "../../commons/commons";
import BreadCrumb from "../Breadcrumb/Breadcrumb";
import TreeSelect from 'react-native-tree-select'


const window = Dimensions.get('window');

class SarViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataTree: [],
            width: window.width,
            treeWidth: window.width * 1/3,
            contentWidth: window.width * 2/3,
            isLoading: false,
            isConnected: true,
            data: [],
            currentItem: {},
            previousItem: []
        }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done((isConnected) => {
            this.setState({
                isConnected: isConnected
            }, () => this.handleFetchData(false));
        });
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
    }

    makeRemoteRequest = () => {
        getAllContentSar(token)
            .then(response => {
                if (response.success) {
                    
                } else {

                }
            })
            .catch(error => console.error(error))
    }

    makeRemoteRequestTree = async (item = {}) => {
        let fileType = ['IMPLICATION', 'QUESTION', 'FILE', 'LINK']
        if (item.name === 'Loading...' || (item.hasOwnProperty('type') && fileType.indexOf(item.type) >= 0)) {
            return;
        }
        const { token } = this.props;
        if (isEmptyJson(item)) {
            //Loading first-time
            type = 'sars'
            getDataSar(token, type)
                .then(responseJson => {
                    var itemList = isEmptyJson(responseJson) ?
                        [] : responseJson.data.map(item => ({ ...item, 
                            id: `${type}${item.id}`, 
                            isLoad: false, 
                            children: [{ 
                                id: getRandomArbitrary(1, 99), 
                                name: 'Loading...' 
                            }] 
                        }));
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                        dataTree: itemList
                    })
                })
        } else {
            let type = getNextType(item.id.replace(/[^a-zA-Z]/g, ''));
            var id = item.id
            if (typeof item.id === 'string') {
                id = item.id.replace(/[^0-9]/g, '');
            }
            if (type === '') {
                return
            }
            if (type === 'suggestions') {
                item.children = item.dataSuggestions[item.id.replace(/[^a-zA-Z]/g, '')]
                    .map(element => ({
                        ...element,
                        isLoad: false,
                        name: element.hasOwnProperty('name') ? 
                        limitText(element.name) : 
                        limitText(element.content),
                        id: `${type}${element.id}`
                    }))
                if (item.id.includes('evidences')) {
                    item.children = item.children.map(element => ({
                        ...element,
                        children: [{ id: getRandomArbitrary(1, 99), name: 'Loading...' }]
                    }));
                }
                this.forceUpdate();
                return
            }
            getDataSar(token, type, id)
                .then(responseJson => {
                    if (type === 'suggestionTypes') {
                        getDataSar(token, 'subCriterions', id)
                            .then(response => {
                                let data = [
                                    { id: `implications${getRandomArbitrary(1, 99)}`, name: 'Implications' },
                                    { id: `questions${getRandomArbitrary(1, 99)}`, name: 'Questions' },
                                    { id: `evidences${getRandomArbitrary(1, 99)}`, name: 'Evidence Types' },
                                    { id: `subCriterions${getRandomArbitrary(1, 99)}`, name: 'Subcriterions' }
                                ]
                                responseJson.data.subCriterions = response.data;
                                item.children = data.map(item => ({
                                    ...item,
                                    isLoad: false,
                                    dataSuggestions: responseJson.data,
                                    children: [{ id: getRandomArbitrary(1, 99), name: 'Loading...' }]
                                }))
                                this.forceUpdate();
                            })
                    } else if (item.hasOwnProperty('type') && item.type === 'EVIDENCE') {
                        item.children = isEmptyJson(responseJson) ?
                            [] : responseJson.data.map(item => ({
                                ...item,
                                isLoad: false, id: `${type}${item.id}`, name: limitText(item.name)
                            }))
                    } else {
                        item.children = isEmptyJson(responseJson) ?
                            [] : responseJson.data.map(item => ({
                                ...item,
                                isLoad: false, id: `${type}${item.id}`,
                                name: limitText(item.name),
                                children: [{ id: getRandomArbitrary(1, 99), name: 'Loading...' }]
                            }))
                    }
                    this.forceUpdate();
                })
        }
    }

    handleConnectivityChange = (isConnected) => {
        this.setState({ isConnected: isConnected }, () => this.handleFetchData())
    };

    handleFetchData = (isAlert = true) => {
        this.setState({
            isLoading: true,
            currentItem: {},
            previousItem: [],
            content: '',
            currentEvidence: {},
            evidenceArray: {},
            dataTree: []
        }, () => {
            if (this.state.isConnected) {
                this.makeRemoteRequestTree()
            } else {
                if (isAlert) {
                    Alert.alert('Error!', 'Connection has been interrupted. Do you want to view offline mode ?',
                        [
                            {
                                text: 'No',
                                style: 'cancel',
                                onPress: () => {
                                    this.setState({
                                        isLoading: false,
                                        refreshing: false,
                                    })
                                }
                            },
                            {
                                text: 'Yes',
                                onPress: () => {
                                    this.makeLocalRequest()
                                }
                            }
                        ]
                    );
                } else {
                    this.makeLocalRequest()
                }
            }
        })
    }

    handleClick = ({ item, routes }) => {
        var { currentItem, previousItem } = this.state;
        if (!item.isLoad) {
            console.log('Variable: handleClick -> item', item)
            this.makeRemoteRequestTree(item)
            item.isLoad = true;
        }
        previousItem = []
        currentItem = {}
        for (var i = 0; i < routes.length; i++) {
            const route = routes[i];
            var listResult = _searchTree(this.state.dataTree, node => node.id === route.id && node.name === route.name)
            if (listResult.length > 0) {
                if (i === routes.length - 1) {
                    currentItem = listResult[0];
                } else {
                    previousItem.push(listResult[0]);
                }
                this.setState({ currentItem: currentItem, previousItem: previousItem })
            }
        }
    }

    render() {
        const { 
            dataTree, 
            isLoading, 
            isConnected, 
            currentItem, 
            previousItem,
            treeWidth,
            contentWidth
        } = this.state
        return (
            <Container>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                >
                    <TouchableOpacity style={styles.menuButton} onPress={() => Actions.drawerOpen()}>
                        <Icon name={AppCommon.icon("menu")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={styles.header}>Sar Viewer</Title>
                    </Body>
                </Header>
                <BreadCrumb
                    isConnected={isConnected}
                    handlePress={this.handlePopTo}
                    previousItem={previousItem}
                    currentItem={currentItem}
                />
                <Grid>
                    <Row>
                        <Col
                            style={{
                                width: treeWidth,
                                borderRightWidth: 1,
                                borderRightColor: 'gray',
                                borderTopWidth: 1,
                                borderTopColor: 'gray',
                            }}
                        >
                            {isLoading ? (
                                <View style={styles.centerView}>
                                    <ActivityIndicator size="large" animating color={AppCommon.colors} />
                                </View>
                            ) : (
                                    <TreeSelect
                                        data={dataTree}
                                        isShowTreeId={false}
                                        itemStyle={{
                                        }}
                                        selectedItemStyle={{
                                            backgroudColor: AppCommon.colors,
                                            color: 'white'
                                        }}
                                        onClick={this.handleClick}
                                        treeNodeStyle={{
                                            openIcon: <Icon style={{ marginRight: 10, fontSize: 16, color: AppCommon.colors }} name="ios-arrow-down" />,
                                            closeIcon: <Icon style={{ marginRight: 10, fontSize: 16, color: AppCommon.colors }} name="ios-arrow-forward" />
                                        }}
                                    />
                                )}
                        </Col>
                        <Col
                            style={{
                                width: contentWidth,
                                borderTopWidth: 1,
                                borderTopWidth: 1,
                                borderTopColor: 'gray',
                            }}
                        >
                            <ScrollView 
                                style={styles.container}
                                contentContainerStyle={styles.contentContainer}
                            >

                            </ScrollView>
                        </Col>
                    </Row>
                </Grid>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: { 
        alignSelf: 'center', 
        color: 'white' 
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        paddingLeft: 10,
        paddingRight: 10
    },
})

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
        admin: state.account.admin,
        directoryInfo: state.directory.directoryInfo
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SarViewer);


