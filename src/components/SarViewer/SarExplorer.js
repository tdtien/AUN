import { Body, Container, Content, Footer, Header, Icon, Right, Text, Title } from "native-base";
import React, { Component } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, NetInfo, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';
import { setDirectoryInfo } from "../../actions/directoryAction";
import { downloadCriterion, downloadSar, downloadSubCriterion, downloadSuggestion, getAllCriterions, getAllEvidences, getAllSars, getAllSubCriterions, getAllSuggestions } from "../../api/directoryTreeApi";
import { AppCommon } from "../../commons/commons";
import { createDirectoryTreeWith, downloadAllEvidences, isEmptyJson, limitText } from "../../commons/utilitiesFunction";
import SarFolder from "./SarFolder";
import SarItem from "./SarItem";
import BreadCrumb from "../Breadcrumb/Breadcrumb";

const window = Dimensions.get('window');
class SarExplorer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isConnected: true,
            isLoading: true,
            refreshing: false,
            scene: [
                { key: 'sars', title: 'All Sars' },
                { key: 'criterions', title: 'All Criterions' },
                { key: 'subCriterions', title: 'All Subcriterions' },
                { key: 'suggestionTypes', title: 'All Suggestion Types' },
                { key: 'suggestions', title: 'All ' },
                { key: 'evidences', title: 'All Evidences' }
            ],
            currentIdx: 0,
            data: [],
            dataSuggestions: {},
            downloadMode: false,
            currentItem: {},
            previousItem: [],
        }
    }

    componentWillMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done((isConnected) => {
            this.setState({
                isConnected: isConnected
            }, () => this.handleFetchData(isConnected, false));
        });
    }

    handleConnectivityChange = (isConnected) => {
        this.setState({ isConnected: isConnected }, () => this.handleFetchData(isConnected))
    };

    handleFetchData = (isConnected, isAlert = true) => {
        this.setState({ isLoading: true })
        if (isConnected) {
            if (isEmptyJson(this.state.currentItem)) {
                this.makeRemoteRequest()
            } else {
                this.makeRemoteRequest(this.state.currentItem.id)
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
                                    data: [],
                                    dataSuggestions: [],
                                    currentIdx: 0,
                                    currentItem: {},
                                    previousItem: []
                                })
                            }
                        },
                        {
                            text: 'Yes', onPress: () => {
                                if (isEmptyJson(this.state.currentItem)) {
                                    this.makeLocalRequest()
                                } else {
                                    this.makeLocalRequest(this.state.currentItem.id)
                                }
                            }
                        }
                    ]
                );
            } else {
                if (isEmptyJson(this.state.currentItem)) {
                    this.makeLocalRequest()
                } else {
                    this.makeLocalRequest(this.state.currentItem.id)
                }
            }
        }
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
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
            localData = directoryInfo[email].find(item => item.id === id).criterions;
        } else if (scene[currentIdx].key === 'subCriterions') {
            localData = directoryInfo[email].find(item => item.id === previousItem[0].id).criterions
                .find(item => item.id === id).subCriterions;
        } else if (scene[currentIdx].key === 'suggestionTypes') {
            localData = [
                { id: 'implications', name: 'Implications' },
                { id: 'questions', name: 'Questions' },
                { id: 'evidences', name: 'Evidence Types' }
            ]
            this.setState({
                dataSuggestions: directoryInfo[email]
                    .find(item => item.id === previousItem[0].id).criterions
                    .find(item => item.id === previousItem[1].id).subCriterions
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
        if (scene[currentIdx].key === 'sars') {
            getAllSars(token)
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
        } else if (scene[currentIdx].key === 'criterions') {
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
        this.setState({ refreshing: true }, () => this.handleRequest(this.state.currentItem.id));
    };

    handleRequest = (id = 0) => {
        if (this.state.isConnected) {
            this.makeRemoteRequest(id)
        } else {
            this.makeLocalRequest(id)
        }
    }

    handlePop = () => {
        if (--this.state.currentIdx > 0) {
            let item = this.state.previousItem.pop();
            this.setState({
                isLoading: true,
                currentItem: item
            }, () => this.handleRequest(item.id));
        } else {
            this.setState({
                isLoading: true,
                currentItem: {},
                previousItem: [],
                currentIdx: 0
            }, () => this.handleRequest())
        }
    }

    handlePopTo = (index, isRoot = false) => {
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
            }, () => this.handleRequest(item.id));
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
        }, () => this.handleRefresh(item.id));
    }

    turnOnDownloadMode = () => {
        if (!this.state.downloadMode && this.state.isConnected) {
            this.setState({ downloadMode: !this.state.downloadMode, data: this.state.data.map(obj => ({ ...obj, checked: false })) })
        }
    }

    turnOffDownloadMode = () => {
        this.setState({ downloadMode: false, data: this.state.data.map(({ checked, ...obj }) => obj) })
    }

    toggleChecked = (item) => {
        let idx = this.state.data.indexOf(item)
        if (idx > -1) {
            let checked = this.state.data[idx].checked
            this.state.data[idx].checked = !checked
            this.setState({ data: this.state.data })
        }
    }

    handleDownloadOffline = () => {
        let selectedData = this.state.data.filter(item => item.checked)
        const { scene, currentIdx, previousItem, currentItem, data } = this.state
        const { token, email, setDirectoryInfo } = this.props
        if (selectedData.length === 0) {
            Alert.alert('Error!', 'No item is selected')
            return
        }
        this.setState({ isLoading: true })
        let pdfFolderPath = AppCommon.directoryPath + AppCommon.pdf_dir + '/' + email;
        if (scene[currentIdx].key === 'sars') {
            selectedData.forEach((selectedItem) => {
                downloadSar(token, selectedItem.id)
                    .then((responseJson) => {
                        let downloadFlow = {
                            sarInfo: selectedItem
                        }
                        let directoryTree = createDirectoryTreeWith(downloadFlow, responseJson.data, 'sar');
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
                                    downloadItemType: 'sar',
                                    downloadFlow: downloadFlow
                                }
                                setDirectoryInfo(directoryInfo);
                            }).catch(error => {
                                this.setState({
                                    isLoading: false,
                                    refreshing: false,
                                    downloadMode: false
                                })
                                console.error('Error when download: ' + error);
                            })
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
                        let directoryTree = createDirectoryTreeWith(downloadFlow, responseJson.data, 'criterion');
                        // console.log('directoryTree: ' + JSON.stringify(directoryTree));
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
                                    downloadItemType: 'criterion',
                                    downloadFlow: downloadFlow
                                }
                                // console.log('responseJson criterion: ' + JSON.stringify(directoryInfo));
                                setDirectoryInfo(directoryInfo);
                            }).catch(error => {
                                this.setState({
                                    isLoading: false,
                                    refreshing: false,
                                    downloadMode: false
                                })
                                console.error('Error when download: ' + error);
                            })
                    })
                    .catch((error) => {
                        this.setState({
                            isLoading: false,
                            refreshing: false,
                        })
                        console.error('Error when download: ' + error);
                    });
            })
        } else if (scene[currentIdx].key === 'subCriterions') {
            selectedData.forEach((selectedItem) => {
                downloadSubCriterion(token, selectedItem.id)
                    .then((responseJson) => {
                        let downloadFlow = {
                            sarInfo: previousItem[0],
                            criterionInfo: currentItem,
                            subCriterionInfo: selectedItem
                        }
                        let directoryTree = createDirectoryTreeWith(downloadFlow, responseJson.data, 'subCriterion');
                        // console.log('directoryTree: ' + JSON.stringify(directoryTree));
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
                                    downloadItemType: 'subCriterion',
                                    downloadFlow: downloadFlow
                                }
                                // console.log('responseJson subCriterion: ' + JSON.stringify(directoryInfo));
                                setDirectoryInfo(directoryInfo);
                            }).catch(error => {
                                this.setState({
                                    isLoading: false,
                                    refreshing: false,
                                    downloadMode: false
                                })
                                console.error('Error when download: ' + error);
                            })
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
                downloadSubCriterion(token, currentItem.id)
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
                            criterionInfo: previousItem[1],
                            subCriterionInfo: currentItem,
                            suggestionTypeName: selectedItem.name.toLowerCase()
                        }
                        let directoryTree = createDirectoryTreeWith(downloadFlow, filterData, 'subCriterion');
                        // console.log('directoryTree: ' + JSON.stringify(directoryTree));
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
                                    downloadItemType: 'suggestionType',
                                    downloadFlow: downloadFlow
                                }
                                // console.log('responseJson suggestion type: ' + JSON.stringify(directoryInfo));
                                setDirectoryInfo(directoryInfo);
                            }).catch(error => {
                                this.setState({
                                    isLoading: false,
                                    refreshing: false,
                                    downloadMode: false
                                })
                                console.error('Error when download: ' + error);
                            })
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
                        let directoryTree = createDirectoryTreeWith(downloadFlow, responseJson.data, 'suggestion');
                        // console.log('directoryTree: ' + JSON.stringify(directoryTree));
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
                                    downloadItemType: 'suggestion',
                                    downloadFlow: downloadFlow
                                }
                                // console.log('responseJson suggestion: ' + JSON.stringify(directoryInfo));
                                setDirectoryInfo(directoryInfo);
                            }).catch(error => {
                                this.setState({
                                    isLoading: false,
                                    refreshing: false,
                                    downloadMode: false
                                })
                                console.error('Error when download: ' + error);
                            })

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
                console.log(downloadFlow, 'downloadFlow')
                let directoryTree = createDirectoryTreeWith(downloadFlow, selectedItem, 'evidence');
                console.log(directoryTree, 'directoryTree')
                // console.log('directoryTree: ' + JSON.stringify(directoryTree));
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
                            downloadItemType: 'evidence',
                            downloadFlow: downloadFlow
                        }
                        console.log(directoryInfo, 'directoryInfo')
                        // console.log('responseJson evidence: ' + JSON.stringify(directoryInfo));
                        setDirectoryInfo(directoryInfo);
                    }).catch(error => {
                        this.setState({
                            isLoading: false,
                            refreshing: false,
                            downloadMode: false
                        })
                        console.log('Error when download: ' + error);
                    })
            })
        } else {
            this.setState({
                isLoading: false,
                refreshing: false,
                downloadMode: false
            })
        }
    }

    renderItem = ({ item }) => {
        let fileType = ['IMPLICATION', 'QUESTION', 'FILE', 'LINK']
        if (item.hasOwnProperty('type') && fileType.indexOf(item.type) >= 0) {
            return (<SarItem
                item={item}
                type={item.type}
                data={this.state.data}
                onLongPress={() => this.turnOnDownloadMode()}
                downloadMode={this.state.downloadMode}
                toggleChecked={() => this.toggleChecked(item)}
            />)
        }
        return (
            <SarFolder
                item={item}
                type={this.state.currentItem.id}
                onPress={() => this.handlePush(item)}
                onLongPress={() => this.turnOnDownloadMode()}
                downloadMode={this.state.downloadMode}
                toggleChecked={() => this.toggleChecked(item)}
            />
        )
    }

    render() {
        const { currentItem, scene, currentIdx, previousItem, downloadMode, isConnected, isLoading } = this.state;
        let currentScene = scene[currentIdx]
        let title = downloadMode ? 'Download Offline' : currentScene.key === 'suggestions' ? currentScene.title + currentItem.name : currentScene.title
        return (
            <Container style={{ backgroundColor: AppCommon.background_color }}>
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
                    isConnected={this.state.isConnected}
                    handlePress={this.handlePopTo}
                    previousItem={this.state.previousItem}
                    currentItem={this.state.currentItem}
                />
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
                        )}
                </Content>
                {/* <Loader loading={this.state.isLoading} /> */}
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
                ) : (<View />)}
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
    footerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20
    },
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
        directoryInfo: state.directory.directoryInfo
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SarExplorer);
