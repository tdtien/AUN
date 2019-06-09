import { Body, Container, Content, Footer, Header, Icon, Right, Text, Title } from "native-base";
import React, { Component } from "react";
import { Alert, Dimensions, FlatList, NetInfo, RefreshControl, StyleSheet, TouchableOpacity, View, AsyncStorage } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';
import { setDirectoryInfo } from "../../actions/directoryAction";
import { downloadCriterion, downloadSar, downloadSubCriterion, downloadSuggestion, getDataSar } from "../../api/directoryTreeApi";
import { AppCommon } from "../../commons/commons";
import { createDirectoryTreeWith, downloadAllEvidences, isEmptyJson, getRandomArbitrary } from "../../commons/utilitiesFunction";
import SarFolder from "./SarFolder";
import SarItem from "./SarItem";
import BreadCrumb from "../Breadcrumb/Breadcrumb";
import AddButton from "./AddButton";
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";
import { Cache } from "react-native-cache";
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';
import Placeholder, { Line, Media } from "rn-placeholder";

const window = Dimensions.get('window');
class SarExplorer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: false,
            isLoading: false,
            refreshing: false,
            downloadMode: false,
            width: window.width,
            subCriterionView: false,
            currentIdx: 0,
            scene: [
                { key: 'sars' },
                { key: 'criterions' },
                { key: 'suggestionTypes' },
                { key: 'suggestions' },
                { key: 'evidences' }
            ],
            data: [],
            previousItem: [],
            currentItem: {}
        }
        this.sarCache = new Cache({
            namespace: "sarEditorCache",
            policy: {
                maxEntries: 50000
            },
            backend: AsyncStorage
        });
        // this.sarCache.clearAll(function (err) {
        // });
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
        let { width } = event.nativeEvent.layout
        if (Math.floor(width) !== Math.floor(this.state.width)) {
            this.setState({ width: width })
        }
    }

    handleConnectivityChange = (isConnected) => {
        this.setState({ isConnected: isConnected }, () => this.handleFetchData())
    };

    handleFetchData = (isAlert = true) => {
        this.setState({
            isLoading: true,
            data: [],
            currentIdx: 0,
            currentItem: {},
            previousItem: []
        }, () => {
            if (isAlert) {
                Alert.alert(I18n.t(keys.Common.lblError), I18n.t(keys.Common.alertNetworkRequestFail),
                    [
                        {
                            text: I18n.t(keys.Common.lblNo),
                            style: 'cancel',
                            onPress: () => {
                                this.setState({
                                    isLoading: false,
                                    refreshing: false,
                                })
                            }
                        },
                        {
                            text: I18n.t(keys.Common.lblYes),
                            onPress: () => {
                                this.handleRequest()
                            }
                        }
                    ]
                );
            } else {
                this.handleRequest()
            }
        })
    }

    makeLocalRequest = (item = {}) => {
        const { scene, currentIdx, previousItem } = this.state;
        const { directoryInfo, email } = this.props;
        var localData = []
        let id = item.id || 0
        if (typeof directoryInfo === 'undefined' || directoryInfo === null || isEmptyJson(directoryInfo)) {
            this.setState({
                isLoading: false,
                refreshing: false,
                data: [],
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
                { id: 'implications', name: I18n.t(keys.SarExplorer.Main.lblImplication) },
                { id: 'questions', name: I18n.t(keys.SarExplorer.Main.lblQuestion) },
                { id: 'evidences', name: I18n.t(keys.SarExplorer.Main.lblEvidenceType) },
                { id: 'subCriterions', name: I18n.t(keys.SarExplorer.Main.lblSubcriterion), disable: true }
            ]
            var dataSuggestions = (Object.keys(directoryInfo).length === 0) ? [] :
                directoryInfo[email]
                    .find(item => item.id === previousItem[0].id).criterions
                    .find(item => item.id === id).suggestions
            var dataSubCriterions = (Object.keys(directoryInfo).length === 0) ? [] :
                directoryInfo[email]
                    .find(item => item.id === previousItem[0].id).criterions
                    .find(item => item.id === id).subCriterions
            dataSubCriterions.forEach((item) => {
                item.key = 'subCriterion'
            })
            dataSuggestions.subCriterions = dataSubCriterions
            localData.forEach(element => {
                element.dataSuggestions = dataSuggestions
            });
        } else if (scene[currentIdx].key === 'suggestions') {
            localData = item.dataSuggestions ? item.dataSuggestions[id] : []
        } else if (scene[currentIdx].key === 'evidences') {
            localData = item.evidences;
        }
        this.setState({
            isLoading: false,
            refreshing: false,
            data: localData
        })
    }

    makeRemoteRequest = (item = {}) => {
        const { scene, currentIdx } = this.state;
        const { token } = this.props;
        let type = scene[currentIdx].key;
        var id = item.id || 0
        if (type === 'suggestions') {
            this.setState({
                isLoading: false,
                refreshing: false,
                data: item.dataSuggestions ? item.dataSuggestions[id] || [] : []
            })
            return
        }
        var dataLoading = []
        for (var i = 0; i < getRandomArbitrary(3, 10); i++) {
            dataLoading.push({
                id: getRandomArbitrary(1, 999),
            })
        }
        this.setState({ data: dataLoading, isLoading: true }, () => {
            getDataSar(token, type, id)
                .then((responseJson) => {
                    if (responseJson && responseJson.success) {
                        if (type === 'suggestionTypes') {
                            getDataSar(token, 'subCriterions', id)
                                .then((response) => {
                                    var data = [
                                        { id: 'implications', name: I18n.t(keys.SarExplorer.Main.lblImplication) },
                                        { id: 'questions', name: I18n.t(keys.SarExplorer.Main.lblQuestion) },
                                        { id: 'evidences', name: I18n.t(keys.SarExplorer.Main.lblEvidenceType) },
                                        { id: 'subCriterions', name: I18n.t(keys.SarExplorer.Main.lblSubcriterion), disable: true }
                                    ]
                                    responseJson.data.subCriterions = response.data;
                                    data.forEach(element => {
                                        element.dataSuggestions = responseJson.data || []
                                    });
                                    this.setState({
                                        isLoading: false,
                                        refreshing: false,
                                        data: data,
                                    }, () => {
                                        this.sarCache.setItem(this.generateCacheKey(item), this.state.data || [], (error) => {
                                            if (error) {
                                                console.error(error)
                                            }
                                        })
                                    })
                                })
                                .catch((error) => {
                                    this.setState({
                                        isLoading: false,
                                        refreshing: false,
                                        data: []
                                    })
                                    console.error(error)
                                })
                        } else {
                            this.setState({
                                isLoading: false,
                                refreshing: false,
                                data: responseJson.data || []
                            }, () => {
                                this.sarCache.setItem(this.generateCacheKey(item), this.state.data || [], (error) => {
                                    if (error) {
                                        console.error(error)
                                    }
                                })
                            })
                        }
                    } else {
                        this.setState({
                            isLoading: false,
                            refreshing: false,
                            data: []
                        })
                    }
                })
                .catch(error => {
                    this.setState({
                        isLoading: false,
                        refreshing: false,
                        data: []
                    })
                    console.error(error)
                })
        })
    }

    generateCacheKey = (item) => {
        let type = this.state.scene[this.state.currentIdx].key;
        return type === 'sars' ? 'root' : `${item.key}${item.type || ''}${item.id}`
    }

    handleRefresh = () => {
        this.setState({ refreshing: true }, () => this.handleRequest(this.state.currentItem, true));
    };

    handleRequest = (item = {}, isRefresh = false) => {
        if (this.state.isConnected) {
            if (isRefresh) {
                this.makeRemoteRequest(item)
            } else {
                this.sarCache.getItem(this.generateCacheKey(item), (error, value) => {
                    if (error) {
                        console.error(error)
                    }
                    if (value) {
                        this.setState({ isLoading: false, refreshing: false, data: value })
                    } else {
                        this.makeRemoteRequest(item)
                    }
                })
            }
        } else {
            this.makeLocalRequest(item)
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
                    currentItem: item,
                    isLoading: true,
                }, () => this.handleRequest(item));
            } else {
                this.setState({
                    currentItem: {},
                    previousItem: [],
                    currentIdx: 0,
                    isLoading: true
                }, () => this.handleRequest())
            }
        }
    }

    handlePopTo = (index, isRoot = false) => {
        if (!this.state.isLoading && !this.state.isTablet) {
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
        if (item.id === 'subCriterions') {
            this.setState({ subCriterionView: true })
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
            this.state.data.map(obj => ({ ...obj, checked: false }));
            this.setState({ downloadMode: !this.state.downloadMode, data: this.state.data })
        }
    }

    turnOffDownloadMode = () => {
        this.state.data.map(({ checked, ...obj }) => obj);
        this.setState({ downloadMode: false, data: this.state.data })
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
        const { scene, currentIdx, previousItem, currentItem, data, subCriterionView } = this.state
        const { token, email } = this.props
        let selectedData = this.state.data.filter(item => item.checked)
        if (selectedData.length === 0) {
            Alert.alert(I18n.t(keys.Common.lblError), I18n.t(keys.SarExplorer.Main.alertNoItemDownload))
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
                        Alert.alert(I18n.t(keys.SarExplorer.Main.lblDownloadOption), I18n.t(keys.SarExplorer.Main.alertDownloadFail));
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
                        Alert.alert(I18n.t(keys.SarExplorer.Main.lblDownloadOption), I18n.t(keys.SarExplorer.Main.alertDownloadFail));
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
                        Alert.alert(I18n.t(keys.SarExplorer.Main.lblDownloadOption), I18n.t(keys.SarExplorer.Main.alertDownloadFail));
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
                        Alert.alert(I18n.t(keys.SarExplorer.Main.lblDownloadOption), I18n.t(keys.SarExplorer.Main.alertDownloadFail));
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
                        Alert.alert(I18n.t(keys.SarExplorer.Main.lblDownloadOption), I18n.t(keys.SarExplorer.Main.alertDownloadFail));
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
                Alert.alert(I18n.t(keys.SarExplorer.Main.lblDownloadOption), I18n.t(keys.SarExplorer.Main.alertDownloadSuccess));
            }).catch(error => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                    downloadMode: false
                })
                console.error('Error when download: ' + error);
                Alert.alert(I18n.t(keys.SarExplorer.Main.lblDownloadOption), I18n.t(keys.SarExplorer.Main.alertDownloadFail));
            })
    }

    renderItem = ({ item, index }) => {
        let fileType = ['IMPLICATION', 'QUESTION', 'FILE', 'LINK']
        const { isConnected, scene, currentIdx, currentItem, data, downloadMode, previousItem, isLoading, refreshing } = this.state;

        // Create index for each item
        item.index = index;
        var rootIndex = '';
        previousItem.forEach(item => {
            rootIndex += `${item.index + 1}.`
        });
        if (!isEmptyJson(currentItem)) {
            rootIndex += `${currentItem.index + 1}.`
        }
        if (item.type && fileType.indexOf(item.type) >= 0) {
            return (
                <Placeholder
                    style={{ paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'row', flex: 1 }}
                    isReady={refreshing ? !refreshing : !isLoading}
                    animation="shine"
                    whenReadyRender={() => (
                        <SarItem
                            item={item}
                            type={item.type}
                            data={data}
                            onLongPress={() => this.turnOnDownloadMode()}
                            downloadMode={downloadMode}
                            toggleChecked={() => this.toggleChecked(item)}
                            rootIndex={rootIndex}
                        />
                    )}
                    renderLeft={() => <Media />}
                >
                    <Line width="85%" />
                    <Line width="75%" />
                </Placeholder>
            )
        }
        return (
            <Placeholder
                style={{ paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'row', flex: 1 }}
                isReady={refreshing ? !refreshing : !isLoading}
                animation="shine"
                whenReadyRender={() => (
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
                )}
                renderLeft={() => <Media />}
            >
                <Line width="85%" />
                <Line width="75%" />
            </Placeholder>
        )
    }

    render() {
        const {
            currentItem, scene, currentIdx, previousItem,
            downloadMode, isConnected, isLoading, data,
            subCriterionView
        } = this.state;
        let currentScene = scene[currentIdx]
        let title = downloadMode ? I18n.t(keys.SarExplorer.Main.Title.download) : I18n.t(keys.SarExplorer.Main.Title.editor);
        return (
            <Container style={{ backgroundColor: AppCommon.background_color }}>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                >
                    {downloadMode ? (
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => this.turnOffDownloadMode()}
                        >
                            <Icon name={AppCommon.icon("close")}
                                style={{ color: 'white', fontSize: AppCommon.icon_size }}
                            />
                        </TouchableOpacity>
                    ) : (
                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={() => currentIdx !== 0 ? this.handlePop() : Actions.drawerOpen()}
                            >
                                <Icon name={AppCommon.icon(currentIdx !== 0 ? "arrow-back" : "menu")}
                                    style={{ color: 'white', fontSize: AppCommon.icon_size }}
                                />
                            </TouchableOpacity>
                        )}
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center", color: 'white' }}>{title}</Title>
                    </Body>
                    <View style={styles.headerMoreButton}>
                        <Menu>
                            <MenuTrigger customStyles={triggerStyles}>
                                <Icon name={AppCommon.icon("more")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={() => this.state.downloadMode ? this.turnOffDownloadMode() : this.turnOnDownloadMode()}>
                                    <View style={styles.popupItem}>
                                        <Icon name={AppCommon.icon("download")} style={{ color: AppCommon.colors, fontSize: AppCommon.icon_size }} />
                                        <Text style={styles.popupItemText}>{I18n.t(keys.SarExplorer.Main.lblDownloadOption)}</Text>
                                    </View>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                </Header>
                <BreadCrumb
                    isConnected={isConnected}
                    handlePress={this.handlePopTo}
                    previousItem={previousItem}
                    currentItem={currentItem}
                />
                <Content
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1, backgroundColor: 'white' }}
                    refreshControl={(typeof data === 'undefined' || data.length === 0) ?
                        <RefreshControl
                            style={{ backgroundColor: '#E0FFFF' }}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                        /> : null
                    }
                >
                    {(typeof data === 'undefined' || data.length === 0) ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#BDBDBD' }}>{I18n.t(keys.Common.lblNoContent)}</Text>
                            <Text style={{ color: '#BDBDBD' }}>{I18n.t(keys.Common.lblReloadRequest)}</Text>
                        </View>
                    ) : (
                            <FlatList
                                data={data}
                                extraData={this.state}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderItem}
                                onRefresh={this.handleRefresh}
                                refreshing={this.state.refreshing}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={50}
                            />
                        )}
                </Content>
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
                                <TouchableOpacity style={{ marginLeft: 20, flexDirection: 'row' }} onPress={() => this.handlePush(data[data.length - 1])} >
                                    <Text style={{ fontSize: AppCommon.font_size, color: 'white', paddingRight: 10 }}>{I18n.t(keys.SarExplorer.Main.lblSubcriterion)}</Text>
                                    <Icon name={AppCommon.icon("arrow-forward")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                                </TouchableOpacity>
                            </View>
                        </Right>
                    </Footer>
                ) : (currentScene.key === 'evidences' && previousItem[0].role !== 'REVIEWER' ? (
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

const triggerStyles = {
    triggerWrapper: {
        padding: 10,
    },
    TriggerTouchableComponent: TouchableOpacity,
};

const styles = StyleSheet.create({
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    headerMoreButton: {
        alignItems: 'center',
        justifyContent: 'center',
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
    },
    popupItem: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    popupItemText: {
        paddingLeft: 25,
        fontSize: 17,
        color: '#2F4F4F'
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
        admin: state.account.admin,
        directoryInfo: state.directory.directoryInfo,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SarExplorer);