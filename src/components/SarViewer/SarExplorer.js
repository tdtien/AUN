import { Body, Container, Content, Footer, Header, Icon, Right, Text, Title, Grid, Col, Row } from "native-base";
import React, { Component } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, NetInfo, RefreshControl, StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';
import { setDirectoryInfo } from "../../actions/directoryAction";
import { downloadCriterion, downloadSar, downloadSubCriterion, downloadSuggestion, getDataSar } from "../../api/directoryTreeApi";
import { AppCommon } from "../../commons/commons";
import { createDirectoryTreeWith, downloadAllEvidences, isEmptyJson, _searchTree, getNextType, limitText, getRandomArbitrary } from "../../commons/utilitiesFunction";
import SarFolder from "./SarFolder";
import SarItem from "./SarItem";
import BreadCrumb from "../Breadcrumb/Breadcrumb";
import AddButton from "./AddButton";
import TreeSelect from 'react-native-tree-select'
import TextViewer from "../TextViewer/TextViewer";

const window = Dimensions.get('window');
class SarExplorer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isConnected: false,
            isLoading: false,
            refreshing: false,
            downloadMode: false,
            isTablet: window.height / window.width < 1.6,
            width: window.width,
            subCriterionView: false,
            currentIdx: 0,
            scene: [
                { key: 'sars', title: 'All Sars' },
                { key: 'criterions', title: 'All Criterions' },
                { key: 'suggestionTypes', title: 'All Suggestion Types' },
                { key: 'suggestions', title: 'All ' },
                { key: 'evidences', title: 'All Evidences' }
            ],
            data: [],
            dataSuggestions: {},
            dataTree: [],
            previousItem: [],
            currentItem: {},
            content: '',
            currentEvidence: {},
            evidenceArray: [],
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

    componentWillReceiveProps(props) {
        this.handleRefresh();
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
    }

    onLayout = event => {
        let { width, height } = event.nativeEvent.layout
        if (Math.floor(width) !== Math.floor(this.state.width)) {
            this.setState({ isTablet: height / width < 1.6, width: width }, () => this.handleFetchData(false))
        }
    }

    handleConnectivityChange = (isConnected) => {
        this.setState({ isConnected: isConnected }, () => this.handleFetchData())
    };

    handleFetchData = (isAlert = true) => {
        this.setState({
            isLoading: true,
            data: [],
            dataSuggestions: [],
            currentIdx: 0,
            currentItem: {},
            previousItem: [],
            content: '',
            currentEvidence: {},
            evidenceArray: {},
            subCriterionView: false,
            dataTree: []
        }, () => {
            if (this.state.isConnected) {
                if (this.state.isTablet) {
                    this.makeRemoteRequestTree()
                } else {
                    this.makeRemoteRequest()
                }
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

    makeLocalRequest = (id = 0) => {
        const { scene, currentIdx, previousItem } = this.state;
        const { directoryInfo, email } = this.props;
        var localData = []
        if (typeof directoryInfo === 'undefined' || directoryInfo === null || isEmptyJson(directoryInfo)) {
            this.setState({
                isLoading: false,
                refreshing: false,
                data: [],
                dataSuggestions: [],
                currentIdx: 0,
                currentItem: {},
                previousItem: []
            })
            return
        }
        if (scene[currentIdx].key === 'sars') {
            localData = (Object.keys(directoryInfo).length === 0) ? [] : directoryInfo[email];
            this.setState({
                isLoading: false,
                refreshing: false,
                data: localData
            })
        } else if (scene[currentIdx].key === 'criterions') {
            localData = (Object.keys(directoryInfo).length === 0) ? [] :
                directoryInfo[email].find(item => item.id === id).criterions;
        } else if (scene[currentIdx].key === 'suggestionTypes') {
            localData = [
                { id: 'implications', name: 'Implications' },
                { id: 'questions', name: 'Questions' },
                { id: 'evidences', name: 'Evidence Types' }
            ]
            localData.subCriterions = (Object.keys(directoryInfo).length === 0) ? [] :
                directoryInfo[email]
                    .find(item => item.id === previousItem[0].id).criterions
                    .find(item => item.id === id).subCriterions
            localData.subCriterions.forEach((item) => {
                item.key = 'subCriterion'
            })
            this.setState({
                dataSuggestions: (Object.keys(directoryInfo).length === 0) ? [] :
                    directoryInfo[email]
                        .find(item => item.id === previousItem[0].id).criterions
                        .find(item => item.id === id).suggestions
            })
        } else if (scene[currentIdx].key === 'suggestions') {
            localData = this.state.dataSuggestions[id]
        } else if (scene[currentIdx].key === 'evidences') {
            localData = this.state.dataSuggestions['evidences'].find(item => item.id === id).evidences;
        }
        this.setState({
            isLoading: false,
            refreshing: false,
            data: localData
        })
    }

    makeRemoteRequest = (id = 0) => {
        const { scene, currentIdx, dataSuggestions } = this.state;
        const { token } = this.props;
        let type = scene[currentIdx].key;
        getDataSar(token, type, id)
            .then((responseJson) => {
                if (type === 'suggestionTypes') {
                    getDataSar(token, 'subCriterions', id)
                        .then((response) => {
                            var data = [
                                { id: 'implications', name: 'Implications' },
                                { id: 'questions', name: 'Questions' },
                                { id: 'evidences', name: 'Evidence Types' },
                            ]
                            data.subCriterions = response.data;
                            this.setState({
                                isLoading: false,
                                refreshing: false,
                                data: data,
                                dataSuggestions: isEmptyJson(responseJson) ? [] : responseJson.data
                            })
                        })
                } else if (type === 'suggestions') {
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                        data: dataSuggestions.length !== 0 ? dataSuggestions[id] : []
                    })
                } else {
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                        data: isEmptyJson(responseJson) ? [] : responseJson.data,
                    })
                }
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                })
                console.error(error)
            })
    }

    makeRemoteRequestTree = (item = {}) => {
        if (item.name === 'Loading...') {
            return;
        }
        const { token } = this.props;
        console.log('Variable: SarExplorer -> makeRemoteRequestTree -> item', item)
        if (isEmptyJson(item)) {
            //Loading first-time
            type = 'sars'
            getDataSar(token, type)
                .then(responseJson => {
                    var itemList = isEmptyJson(responseJson) ?
                        [] : responseJson.data.map(item => ({ ...item, id: `${type}${item.id}`, isLoad: false, children: [{ id: getRandomArbitrary(1, 99), name: 'Loading...' }] }));
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
                    .map(item => ({ ...item, isLoad: false, name: item.hasOwnProperty('name') ? limitText(item.name) : limitText(item.content), id: `${type}${item.id}` }))
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
                                item.children = data.map(item => ({ ...item, isLoad: false, dataSuggestions: responseJson.data, children: [{ id: getRandomArbitrary(1, 99), name: 'Loading...' }] }))
                            })
                    } else {
                        item.children = isEmptyJson(responseJson) ?
                            [] : responseJson.data.map(item => ({ ...item, isLoad: false, id: `${type}${item.id}`, name: limitText(item.name), children: [{ id: getRandomArbitrary(1, 99), name: 'Loading...' }] }))
                    }
                    this.forceUpdate();
                })
        }
    }

    handleRefresh = () => {
        this.setState({ refreshing: true }, () => this.handleRequest(this.state.currentItem));
    };

    handleRequest = (item = {}) => {
        if (this.state.isConnected) {
            this.makeRemoteRequest(item.id)
        } else {
            this.makeLocalRequest(item.id)
        }
    }

    handleClick = ({ item, routes }) => {
        var { currentItem, previousItem, content, currentEvidence, evidenceArray } = this.state;
        if (!item.isLoad) {
            this.makeRemoteRequestTree(item)
            item.isLoad = true;
        }
        previousItem = []
        currentItem = {}
        content = ''
        currentEvidence = {}
        evidenceArray = []
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
        if (item.hasOwnProperty('content')) {
            this.setState({ content: item.content })
        } else {
            this.setState({ content: item.description })
        }
        if (item.key === 'evidence' && previousItem.length > 0) {
            this.setState({ currentEvidence: item, evidenceArray: previousItem[previousItem.length - 1].children })
        }
    }

    handlePop = () => {
        if (!this.state.isLoading) {
            if (this.state.subCriterionView) {
                this.setState({ subCriterionView: false })
            }
            if (--this.state.currentIdx > 0) {
                let item = this.state.previousItem.pop();
                this.setState({
                    isLoading: true,
                    currentItem: item
                }, () => this.handleRequest(item));
            } else {
                this.setState({
                    isLoading: true,
                    currentItem: {},
                    previousItem: [],
                    currentIdx: 0
                }, () => this.handleRequest())
            }
        }
    }

    handlePopTo = (index, isRoot = false) => {
        if (!this.state.isLoading) {
            if (this.state.subCriterionView) {
                this.setState({ subCriterionView: false })
            }
            if (isRoot) {
                this.setState({
                    isLoading: true,
                    currentItem: {},
                    previousItem: [],
                    currentIdx: 0
                }, () => this.handleRequest())
            } else if (index >= 0 && index < this.state.currentIdx) {
                let item = this.state.previousItem[index];
                this.state.currentIdx = index + 1;
                this.state.previousItem.splice(index, this.state.previousItem.length - index)
                this.setState({
                    isLoading: true,
                    currentItem: item
                }, () => this.handleRequest(item));
            }
        }
    }

    handlePush = (item) => {
        if (this.state.currentIdx !== 0) {
            this.state.previousItem.push(this.state.currentItem);
        }
        this.state.currentIdx++;
        this.setState({
            isLoading: true,
            currentItem: item
        }, () => this.handleRequest(item));
    }

    handleComment = (item) => {
        Actions.comment({ subCriterionInfo: item })
    }

    turnOnDownloadMode = () => {
        if (!this.state.downloadMode && this.state.isConnected) {
            var dataSource = this.state.subCriterionView ? this.state.data.subCriterions : this.state.data;
            dataSource.map(obj => ({ ...obj, checked: false }));
            this.setState({ downloadMode: !this.state.downloadMode, data: this.state.data })
        }
    }

    turnOffDownloadMode = () => {
        var dataSource = this.state.subCriterionView ? this.state.data.subCriterions : this.state.data;
        dataSource.map(({ checked, ...obj }) => obj);
        this.setState({ downloadMode: false, data: this.state.data })
    }

    toggleChecked = (item) => {
        var dataSource = this.state.subCriterionView ? this.state.data.subCriterions : this.state.data;
        let idx = dataSource.indexOf(item)
        if (idx > -1) {
            let checked = dataSource[idx].checked
            dataSource[idx].checked = !checked
            this.setState({ data: this.state.data })
        }
    }

    handleDownloadOffline = () => {
        const { scene, currentIdx, previousItem, currentItem, data, subCriterionView } = this.state
        const { token, email, setDirectoryInfo } = this.props
        var dataSource = subCriterionView ? data.subCriterions : data;
        let selectedData = dataSource.filter(item => item.checked)
        if (selectedData.length === 0) {
            Alert.alert('Error!', 'No item is selected')
            return
        }
        this.setState({ isLoading: true })
        if (scene[currentIdx].key === 'sars') {
            selectedData.forEach((selectedItem) => {
                downloadSar(token, selectedItem.id)
                    .then((responseJson) => {
                        let downloadFlow = {
                            sarInfo: selectedItem
                        }
                        this.downloadTree(email, 'sar', responseJson.data, downloadFlow);
                    })
                    .catch((error) => {
                        this.setState({
                            isLoading: false,
                            refreshing: false,
                        })
                        console.error('Error when download: ' + error);
                    });
            })
        } else if (scene[currentIdx].key === 'criterions') {
            selectedData.forEach((selectedItem) => {
                downloadCriterion(token, selectedItem.id)
                    .then((responseJson) => {
                        let downloadFlow = {
                            sarInfo: currentItem,
                            criterionInfo: selectedItem
                        }
                        this.downloadTree(email, 'criterion', responseJson.data, downloadFlow);
                    })
                    .catch((error) => {
                        this.setState({
                            isLoading: false,
                            refreshing: false,
                        })
                        console.error('Error when download: ' + error);
                    });
            })
        } else if (subCriterionView) {
            selectedData.forEach((selectedItem) => {
                downloadSubCriterion(token, selectedItem.id)
                    .then((responseJson) => {
                        let downloadFlow = {
                            sarInfo: previousItem[0],
                            criterionInfo: currentItem,
                            subCriterionInfo: selectedItem
                        }
                        this.downloadTree(email, 'subCriterion', responseJson.data, downloadFlow);
                    })
                    .catch((error) => {
                        this.setState({
                            isLoading: false,
                            refreshing: false,
                        })
                        console.error('Error when download: ' + error);
                    });
            })
        } else if (scene[currentIdx].key === 'suggestionTypes') {
            selectedData.forEach((selectedItem) => {
                downloadCriterion(token, currentItem.id)
                    .then((responseJson) => {
                        // console.log('responseJson: ' + JSON.stringify(responseJson.data));
                        let index = data.indexOf(selectedItem);
                        let filterData = responseJson.data;
                        if (index === 0) {
                            filterData.suggestions = {
                                'implications': filterData.suggestions.implications
                            };
                        } else if (index === 1) {
                            filterData.suggestions = {
                                'questions': filterData.suggestions.questions
                            };
                        } else {
                            filterData.suggestions = {
                                'evidences': filterData.suggestions.evidences
                            };
                        }
                        let downloadFlow = {
                            sarInfo: previousItem[0],
                            criterionInfo: currentItem,
                            suggestionType: selectedItem.name === 'Evidence Types' ? 'evidences' : selectedItem.name.toLowerCase()
                        }
                        this.downloadTree(email, 'suggestionType', filterData, downloadFlow);
                    })
                    .catch((error) => {
                        this.setState({
                            isLoading: false,
                            refreshing: false,
                        })
                        console.error('Error when download: ' + error);
                    });
            })
        } else if (scene[currentIdx].key === 'suggestions') {
            selectedData.forEach((selectedItem) => {
                downloadSuggestion(token, selectedItem.id)
                    .then((responseJson) => {
                        // console.log('responseJson: ' + JSON.stringify(responseJson.data));
                        let downloadFlow = {
                            sarInfo: previousItem[0],
                            criterionInfo: previousItem[1],
                            subCriterionInfo: previousItem[2],
                            suggestionType: currentItem.id,
                            suggestionInfo: selectedItem,
                        }
                        this.downloadTree(email, 'suggestion', responseJson.data, downloadFlow);
                    })
                    .catch((error) => {
                        this.setState({
                            isLoading: false,
                            refreshing: false,
                        })
                        console.error('Error when download: ' + error);
                    });
            })
        } else if (scene[currentIdx].key === 'evidences') {
            selectedData.forEach((selectedItem) => {
                let downloadFlow = {
                    sarInfo: previousItem[0],
                    criterionInfo: previousItem[1],
                    subCriterionInfo: previousItem[2],
                    suggestionInfo: currentItem,
                    evidenceInfo: selectedItem
                }
                this.downloadTree(email, 'evidence', selectedItem, downloadFlow);
            })
        } else {
            this.setState({
                isLoading: false,
                refreshing: false,
                downloadMode: false
            })
        }
    }

    downloadTree = (email, type, data, downloadFlow) => {
        let pdfFolderPath = AppCommon.directoryPath + AppCommon.pdf_dir + '/' + email;
        let directoryTree = createDirectoryTreeWith(downloadFlow, data, type);
        downloadAllEvidences(directoryTree, pdfFolderPath)
            .then(response => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                    downloadMode: false
                })
                var directoryInfo = {
                    email: email,
                    directoryTree: response,
                    downloadItemType: type,
                    downloadFlow: downloadFlow
                }
                // console.log('directoryInfo: ' + JSON.stringify(directoryInfo));
                this.props.setDirectoryInfo(directoryInfo);
            }).catch(error => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                    downloadMode: false
                })
                console.error('Error when download: ' + error);
            })
    }

    renderItem = ({ item, index }) => {
        let fileType = ['IMPLICATION', 'QUESTION', 'FILE', 'LINK']
        const { isConnected, scene, currentIdx, currentItem, data, downloadMode, previousItem } = this.state;
        item.index = index;
        var rootIndex = '';
        previousItem.forEach(item => {
            rootIndex += `${item.index + 1}.`
        });
        if (!isEmptyJson(currentItem)) {
            rootIndex += `${currentItem.index + 1}.`
        }
        if (item.hasOwnProperty('type') && fileType.indexOf(item.type) >= 0) {
            return (<SarItem
                item={item}
                type={item.type}
                data={data}
                onLongPress={() => this.turnOnDownloadMode()}
                downloadMode={downloadMode}
                toggleChecked={() => this.toggleChecked(item)}
                rootIndex={rootIndex}
            />)
        }
        return (
            <SarFolder
                item={item}
                type={currentItem.id}
                sceneKey={scene[currentIdx].key}
                onPress={() => item.key === 'subCriterion' ? this.handleComment(item) : this.handlePush(item)}
                onLongPress={() => this.turnOnDownloadMode()}
                downloadMode={downloadMode}
                toggleChecked={() => this.toggleChecked(item)}
                rootIndex={rootIndex}
                isConnected={isConnected}
            />
        )
    }

    render() {
        const { currentItem, scene, currentIdx, previousItem, downloadMode, isConnected, isLoading, isTablet, subCriterionView, width } = this.state;
        let currentScene = scene[currentIdx]
        let title = downloadMode ? 'Download Offline' :
            currentScene.key === 'suggestions' ? currentScene.title + currentItem.name :
                subCriterionView ? 'All Subcriterions' : currentScene.title
        return (
            <Container style={{ backgroundColor: AppCommon.background_color }} onLayout={this.onLayout}>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                >
                    {downloadMode ? (
                        <TouchableOpacity style={styles.menuButton} onPress={() => this.turnOffDownloadMode()}>
                            <Icon name={AppCommon.icon("close")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                        </TouchableOpacity>
                    ) : (
                            currentIdx !== 0 ? (
                                <TouchableOpacity style={styles.menuButton} onPress={() => this.handlePop()}>
                                    <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                                </TouchableOpacity>
                            ) : (
                                    <TouchableOpacity style={styles.menuButton} onPress={() => Actions.drawerOpen()}>
                                        <Icon name={AppCommon.icon("menu")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                                    </TouchableOpacity>
                                )
                        )}
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center", color: 'white' }}>{title}</Title>
                    </Body>
                </Header>
                <BreadCrumb
                    isConnected={isConnected}
                    handlePress={this.handlePopTo}
                    previousItem={previousItem}
                    currentItem={currentItem}
                />
                {isTablet ? (
                    <Grid>
                        <Row>

                            <Col
                                style={{
                                    width: width * 1 / 3,
                                    borderRightWidth: 1,
                                    borderRightColor: 'gray',
                                    borderTopWidth: 1,
                                    borderTopColor: 'gray',
                                }}
                            >
                                {isLoading ? (
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator size="large" animating color={AppCommon.colors} />
                                    </View>
                                ) : (
                                        <TreeSelect
                                            data={this.state.dataTree}
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
                                    width: width * 2 / 3,
                                    borderTopWidth: 1,
                                    borderTopWidth: 1,
                                    borderTopColor: 'gray',
                                }}
                            >
                                {isEmptyJson(this.state.currentEvidence) || !this.state.content || this.state.content === '' ? (
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: '#BDBDBD' }}>There is no content</Text>
                                    </View>
                                ) : (
                                        <TextViewer data={this.state.content} title='' hasHeader={false} />
                                    )}
                            </Col>
                        </Row>
                    </Grid>
                ) : (

                        <Content
                            style={{ flex: 1 }}
                            contentContainerStyle={{ flex: 1 }}
                            refreshControl={(typeof this.state.data === 'undefined' || this.state.data.length === 0) ?
                                <RefreshControl
                                    style={{ backgroundColor: '#E0FFFF' }}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.handleRefresh}
                                /> : null
                            }
                        >
                            {isLoading ? (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="large" animating color={AppCommon.colors} />
                                </View>
                            ) : (
                                    (typeof this.state.data === 'undefined' || this.state.data.length === 0) ? (
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: '#BDBDBD' }}>There is no content</Text>
                                            <Text style={{ color: '#BDBDBD' }}>Pull to refresh</Text>
                                        </View>
                                    ) : (
                                            <FlatList
                                                data={subCriterionView ? this.state.data.subCriterions : this.state.data}
                                                extraData={this.state}
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
                    )}
                {downloadMode ? (
                    <Footer
                        style={{ backgroundColor: AppCommon.colors }}
                    >
                        <Right>
                            <View style={styles.footerButton}>
                                <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => this.handleDownloadOffline()} >
                                    <Icon name={AppCommon.icon("cloud-download")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                                </TouchableOpacity>
                            </View>
                        </Right>
                    </Footer>
                ) : (currentScene.key === 'suggestionTypes' && !subCriterionView ? (
                    <Footer
                        style={{ backgroundColor: AppCommon.colors }}
                    >
                        <Right>
                            <View style={styles.footerButton}>
                                <TouchableOpacity style={{ marginLeft: 20, flexDirection: 'row' }} onPress={() => this.setState({ subCriterionView: true })} >
                                    <Text style={{ fontSize: AppCommon.font_size, color: 'white', paddingRight: 10 }}>View Subcriterions</Text>
                                    <Icon name={AppCommon.icon("arrow-forward")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                                </TouchableOpacity>
                            </View>
                        </Right>
                    </Footer>
                ) : (currentScene.key === 'evidences' && this.props.role !== 'REVIEWER' ? (
                    <AddButton
                        sarInfo={previousItem[0]}
                        criterionInfo={previousItem[1]}
                        subCriterionInfo={previousItem[2]}
                        suggestionInfo={currentItem}
                        token={this.props.token}
                        handleRefresh={this.handleRefresh}
                    />
                ) : (<View />)))}
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
    addButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        bottom: 20,
        right: 20,
        borderRadius: 60,
        backgroundColor: AppCommon.colors,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20
    },
    text: {
        paddingHorizontal: 20,
        padding: 10,
        textAlign: 'justify',
        color: '#404040',
        // fontWeight: '100',
        // letterSpacing: 20
    }
});

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
        role: state.account.role,
        directoryInfo: state.directory.directoryInfo
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SarExplorer);
