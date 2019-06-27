import _ from 'lodash';
import { Body, Col, Container, Grid, Header, Icon, Row, Title } from "native-base";
import React, { Component } from "react";
import { RefreshControl, Alert, Dimensions, Linking, NetInfo, ScrollView, StyleSheet, Text, TouchableOpacity, View, AsyncStorage } from "react-native";
import TreeView from 'react-native-final-tree-view';
import HTML from 'react-native-render-html';
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';
import Placeholder, { Line } from "rn-placeholder";
import { getAllAvailableSar, getContentSar, getAllVersionSar } from "../../api/directoryTreeApi";
import { AppCommon } from "../../commons/commons";
import { _searchTree } from "../../commons/utilitiesFunction";
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';
import BreadCrumb from "../Breadcrumb/Breadcrumb";
import { Cache } from "react-native-cache";
import SideMenu from "react-native-side-menu";
import { IGNORED_TAGS, alterNode, makeCustomTableRenderer } from 'react-native-render-html-table-bridge';
import ClickTable from './ClickTable';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from "react-native-popup-menu";

const window = Dimensions.get('window');

const renderers = {
    table: makeCustomTableRenderer(ClickTable)
};

const htmlConfig = {
    alterNode,
    renderers,
    ignoredTags: IGNORED_TAGS,
    onLinkPress: (e, href) => {
        Linking.openURL(href)
    }
};

class SarViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataTree: [],
            treeWidth: window.width * 1 / 4,
            contentWidth: window.width * 3 / 4,
            isLoading: false,
            isLoadingContent: false,
            isConnected: true,
            refreshing: false,
            refreshingTree: false,
            data: {},
            currentItem: {},
            previousItem: [],
            position: 10,
            isTablet: window.height / window.width < 1.6,
            width: window.width,
        }

        this.sarCache = new Cache({
            namespace: "sarViewerCache",
            policy: {
                maxEntries: 1000
            },
            backend: AsyncStorage
        });

        this.mounted = false
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done((isConnected) => {
            this.setState({
                isConnected: isConnected
            }, () => this.handleFetchData());
        });
        this.mounted = true
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
        this.mounted = false
    }

    componentWillReceiveProps(props) {
        this.handleRefresh();
    }

    makeRemoteRequest = async (item, callback = {}) => {
        const { token } = this.props
        getAllVersionSar(token, item.id)
            .then(responseVersion => {
                if (responseVersion && responseVersion.success) {
                    let versionList = responseVersion.data.filter(version => version.release === true)
                    if (versionList.length > 0) {
                        let lastVersion = versionList[0].version
                        getContentSar(token, item.id, lastVersion)
                            .then(response => {
                                if (response && response.success) {
                                    response.data.index = response.data.id
                                    response.data.internalId = _.uniqueId('tree_')
                                    this.generateIndex(response.data, response.data.index, response.data.id)
                                    let foundIndex = this.state.dataTree.findIndex((value) => value === item)
                                    if (foundIndex >= 0) {
                                        this.state.dataTree[foundIndex] = response.data
                                    }
                                    this.mounted && this.setState({
                                        isLoadingContent: false,
                                        refreshing: false,
                                        data: response.data || [],
                                    }, () => {
                                        this.sarCache.setItem(`${item.key}${item.id}`, this.state.data, (error) => {
                                            if (error) {
                                                console.log(error)
                                            }
                                        })
                                        if (typeof callback === 'function') {
                                            setTimeout(callback, 100)
                                        }
                                    })
                                } else {
                                    this.mounted && this.setState({ isLoadingContent: false, refreshing: false, data: [] })
                                }
                            })
                            .catch(error => {
                                this.mounted && this.setState({ isLoadingContent: false, refreshing: false, data: [] })
                                console.log(error)
                            })
                    } else {
                        this.mounted && this.setState({ isLoadingContent: false, refreshing: false, data: [] })
                    }
                }
            })
            .catch(error => {
                this.mounted && this.setState({ isLoadingContent: false, refreshing: false, data: [] })
                console.log(error)
            })
    }

    generateIndex = (item, rootIndex, rootId) => {
        return item.children && item.children.forEach((child, index) => {
            child.index = `${rootIndex}.${index + 1}`
            child.internalId = _.uniqueId('tree_')
            child.rootId = rootId
            this.generateIndex(child, child.index, rootId)
        });
    }

    makeRemoteRequestTree = async () => {
        const { token } = this.props;
        getAllAvailableSar(token)
            .then(responeJson => {
                if (responeJson && responeJson.success) {
                    responeJson.data.forEach((element) => {
                        element.index = element.id
                        element.internalId = _.uniqueId('tree_')
                        this.generateIndex(element, element.index, element.id)
                    })
                    this.mounted && this.setState({
                        dataTree: responeJson.data || [],
                        isLoading: false,
                        refreshingTree: false
                    }, () => {
                        this.sarCache.setItem('root', this.state.dataTree, (error) => {
                            if (error) {
                                console.log(error)
                            }
                        })
                    })
                } else {
                    this.mounted && this.setState({
                        isLoading: false,
                        dataTree: [],
                        refreshingTree: false
                    })
                }
            })
            .catch(error => {
                this.mounted && this.setState({
                    isLoading: false,
                    dataTree: [],
                    refreshingTree: false
                })
                console.log(error)
            })
    }

    handleConnectivityChange = (isConnected) => {
        this.setState({ isConnected: isConnected }, () => this.handleFetchData())
    };

    handleRefresh = () => {
        this.setState({ refreshing: true, position: 10 }, () => this.handleRequest(this.state.currentItem, true));
    }

    handleRefreshTree = () => {
        this.setState({ refreshingTree: true }, () => this.handleRequest({}, true));
    }

    handleRequest = (item = {}, isRefresh = false, callback = {}) => {
        if (this.state.isConnected) {
            if (isRefresh) {
                if (_.isEmpty(item)) {
                    this.makeRemoteRequestTree()
                } else {
                    this.makeRemoteRequest(item)
                }
            } else {
                let key = _.isEmpty(item) ? 'root' : `${item.key}${item.id}`
                this.sarCache.getItem(key, (error, value) => {
                    if (error) {
                        console.log(error)
                    }
                    if (value) {
                        this.setState({ isLoading: false, isLoadingContent: false })
                        if (key === 'root') {
                            this.setState({ dataTree: value })
                        } else {
                            let foundIndex = this.state.dataTree.findIndex((value) => value.id === item.id)
                            if (foundIndex >= 0) {
                                this.state.dataTree[foundIndex] = value
                            }
                            this.setState({
                                data: value,
                            }, () => {
                                if (typeof callback === 'function') {
                                    setTimeout(callback, 100)
                                }
                            })
                        }
                    } else {
                        if (_.isEmpty(item)) {
                            this.makeRemoteRequestTree()
                        } else {
                            this.makeRemoteRequest(item)
                        }
                    }
                })
            }
        } else {
            let key = _.isEmpty(item) ? 'root' : `${item.key}${item.id}`
            this.sarCache.getItem(key, (error, value) => {
                if (error) {
                    console.log(error)
                }
                this.setState({ isLoading: false, isLoadingContent: false })
                if (key === 'root') {
                    this.setState({ dataTree: value || [] })
                } else {
                    this.setState({ data: value || [] })
                }
            })
        }
    }

    handleFetchData = () => {
        this.setState({
            isLoading: true,
            currentItem: {},
            previousItem: [],
            dataTree: []
        }, () => this.handleRequest())
    }

    handleClick = (item, level) => {
        const { currentItem } = this.state
        if (item.key === 'sar') {
            if (!_.isEmpty(currentItem)) {
                if (item.id !== currentItem.id) {
                    this.setState({ isLoadingContent: true, position: 10, currentItem: item }, () => this.handleRequest(item))
                }
            } else {
                this.setState({ isLoadingContent: true, position: 10, currentItem: item }, () => this.handleRequest(item))
            }
        } else {
            if (item.rootId !== currentItem.id) {
                let rootItemResult = _searchTree(this.state.dataTree, (node) => node.id === item.rootId)
                if (rootItemResult.length > 0) {
                    this.setState({
                        isLoadingContent: true,
                        position: 10,
                        currentItem: rootItemResult[0]
                    }, () => this.handleRequest(rootItemResult[0], false, () => {
                        this.scrollView.scrollTo({ x: 0, y: item.offSet, animated: true })
                    }))
                }
            } else {
                if (item.offSet) {
                    this.scrollView.scrollTo({ x: 0, y: item.offSet, animated: true })
                }
            }
        }
    }

    // changeVersionContent = (item) => {
    //     const { token } = this.props
    //     this.setState({ isLoadingContent: true, position: 10 })
    //     getContentSar(token, item.sarId, item.version)
    //         .then(response => {
    //             if (response && response.success) {
    //                 response.data.index = response.data.id
    //                 response.data.internalId = _.uniqueId('tree_')
    //                 this.generateIndex(response.data, response.data.index, response.data.id)
    //                 let foundIndex = this.state.dataTree.findIndex((value) => value.id === item.id)
    //                 if (foundIndex >= 0) {
    //                     this.state.dataTree[foundIndex] = response.data
    //                 }
    //                 this.mounted && this.setState({
    //                     isLoadingContent: false,
    //                     refreshing: false,
    //                     data: response.data || [],
    //                     currentVersion: item.version
    //                 }, () => {
    //                     this.sarCache.setItem(`${item.key}${item.id}`, this.state.data, (error) => {
    //                         if (error) {
    //                             console.log(error)
    //                         }
    //                     })
    //                     if (typeof callback === 'function') {
    //                         setTimeout(callback, 100)
    //                     }
    //                 })
    //             } else {
    //                 this.mounted && this.setState({ isLoadingContent: false, refreshing: false, data: [] })
    //             }
    //         })
    //         .catch(error => {
    //             this.mounted && this.setState({ isLoadingContent: false, refreshing: false, data: [] })
    //             console.log(error)
    //         })
    // }

    putOffSet = (item, position = 0) => {
        let itemInTreeResult = _searchTree(this.state.dataTree, (node) => node.id === item.id && node.key === item.key)
        if (itemInTreeResult.length > 0) {
            var itemInTree = itemInTreeResult[0]
            itemInTree.offSet = position
        }
    }

    onLayout = event => {
        let { width, height } = event.nativeEvent.layout
        if (Math.floor(width) !== Math.floor(this.state.width)) {
            this.setState({
                width: width,
                treeWidth: width * 1 / 4,
                contentWidth: width * 3 / 4,
                isTablet: height / width < 1.6,
                position: 10
            })
        }
    }

    renderItem = (item, level) => {
        return (
            <View>
                <View style={{ marginLeft: 10 * level, flexDirection: 'row' }}>
                    <Icon name={AppCommon.icon(
                        item.collapsed !== null ? (
                            item.collapsed ? 'arrow-dropright' : 'arrow-dropdown'
                        ) : (
                                'information'
                            )
                    )} style={{ paddingRight: 5, color: item.commentCount > 0 || item.noteCount > 0 ? AppCommon.colors : '#cccccc', fontSize: item.commentCount > 0 || item.noteCount > 0 ? 25 : 20 }} />
                    <Text style={{ color: 'black', fontWeight: item.collapsed != null && !item.collapsed ? 'bold' : 'normal' }}>{`${item.index}. ${item.name}`}</Text>
                </View>
            </View>
        )
    }

    renderContent = (data) => {
        return (
            <View
                style={{ flex: 1 }}
            >
                <Text
                    onLayout={({ nativeEvent }) => {
                        this.putOffSet(data)
                        this.state.position += nativeEvent.layout.height
                    }}
                    style={{ fontSize: 25, alignSelf: 'center', fontWeight: 'bold', color: 'black' }}
                >{data.name}</Text>
                {data.children.map((item, index) => {
                    return (
                        <View
                            key={_.uniqueId()}
                        >
                            {item.name && <Text
                                onLayout={({ nativeEvent }) => {
                                    this.putOffSet(item, this.state.position)
                                    this.state.position += nativeEvent.layout.height
                                }}
                                style={{ fontSize: 20, paddingLeft: 10, fontWeight: 'bold', color: 'black' }}>{`${data.id}.${index + 1}. ${item.name}`}</Text>}
                            {item.children && this.renderChildren(item.children, `${data.id}.${index + 1}`)}
                        </View>
                    )
                })}
            </View>
        )
    }

    renderChildren = (items, rootIndex) => {
        return items.map((item, index) => {
            if (item.content) {
                item.content = item.content.replace(/windowtext/g, '#000000');
            }
            return (
                <View
                    key={_.uniqueId()}
                >
                    {item.name && <Text
                        onLayout={({ nativeEvent }) => {
                            this.putOffSet(item, this.state.position)
                            this.state.position += nativeEvent.layout.height
                        }}
                        style={{ fontSize: 16, paddingLeft: 10, fontWeight: 'bold', color: 'black' }}>{`${rootIndex}.${index + 1}. ${item.name}`}</Text>}
                    {item.key === 'subCriterion' &&
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{ alignSelf: 'flex-end', flexDirection: 'row' }}
                            onPress={() => Actions.comment({ subCriterionInfo: item, isEditor: 0 })}
                            onLayout={({ nativeEvent }) => {
                                this.state.position += nativeEvent.layout.height
                            }}
                        >
                            <Text style={{ paddingHorizontal: 5, color: item.commentCount > 0 ? AppCommon.colors : '#cccccc' }}>{item.commentCount}</Text>
                            <Icon name="comment" type="MaterialIcons" style={{ color: item.commentCount > 0 ? AppCommon.colors : '#cccccc', fontSize: 13 }} />
                            <Text style={{ paddingHorizontal: 5, color: item.noteCount > 0 ? AppCommon.colors : '#cccccc' }}>{item.noteCount}</Text>
                            <Icon name="note" type="SimpleLineIcons" style={{ color: item.noteCount > 0 ? AppCommon.colors : '#cccccc', fontSize: 13 }} />
                        </TouchableOpacity>
                    }
                    {item.content &&
                        <View
                            onLayout={({ nativeEvent }) => {
                                this.state.position += nativeEvent.layout.height
                            }}
                            style={{ flex: 1 }}
                        >
                            <HTML
                                html={`${item.content}`}
                                imagesMaxWidth={this.state.isTablet ? this.state.contentWidth : this.state.width}
                                onLinkPress={(evt, href) => Linking.openURL(href)}
                                baseFontStyle={{ color: 'black' }}
                                {...htmlConfig}
                            />
                        </View>
                    }
                    {item.children && this.renderChildren(item.children, `${rootIndex}.${index + 1}`)}
                </View>
            )
        })
    }

    render() {
        const {
            dataTree,
            isLoading,
            isLoadingContent,
            isConnected,
            currentItem,
            previousItem,
            treeWidth,
            contentWidth,
            refreshing,
            isTablet,
            refreshingTree
        } = this.state
        if (!isTablet) {
            return (
                <SideMenu
                    bounceBackOnOverdraw={false}
                    onSliding={(percentage) => {
                        if (percentage >= 1) {
                            percentage = 1
                        }
                        if (percentage <= 0) {
                            percentage = 0
                        }
                    }}
                    autoClosing={false}
                    menu={
                        <View style={styles.container}>
                            <Header
                                androidStatusBarColor={AppCommon.colors}
                                iosBarStyle="light-content"
                                style={{ backgroundColor: AppCommon.colors }}
                            >
                                <Body style={{ flex: 1 }}>
                                    <Title style={styles.header}>{I18n.t(keys.SarViewer.Main.lblCategory)}</Title>
                                </Body>
                            </Header>
                            <ScrollView
                                style={styles.container}
                                contentContainerStyle={styles.contentContainer}
                                refreshControl={
                                    <RefreshControl
                                        style={{ backgroundColor: '#E0FFFF' }}
                                        refreshing={refreshingTree}
                                        onRefresh={this.handleRefreshTree}
                                    />
                                }
                            >
                                <Placeholder
                                    animation="fade"
                                    isReady={refreshingTree ? !refreshingTree : !isLoading}
                                    whenReadyRender={() => (
                                        <TreeView
                                            ref={ref => (this.treeView = ref)}
                                            data={dataTree}
                                            idKey="internalId"
                                            renderItem={this.renderItem}
                                            onItemPress={this.handleClick}
                                        />
                                    )}
                                >
                                    {Array.from({ length: _.random(5, 10) }, () => _.random(30, 100)).map((item) => (
                                        <Line key={_.uniqueId('view')} width={`${item}%`} />
                                    ))}
                                </Placeholder>
                            </ScrollView>
                        </View>
                    }
                    edgeHitWidth={this.state.width / 2}
                >
                    <Container onLayout={this.onLayout}>
                        <Header
                            androidStatusBarColor={AppCommon.colors}
                            iosBarStyle="light-content"
                            style={{ backgroundColor: AppCommon.colors }}
                        >
                            <TouchableOpacity style={styles.menuButton} onPress={() => Actions.drawerOpen()}>
                                <Icon name={AppCommon.icon("menu")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                            </TouchableOpacity>
                            <Body style={{ flex: 1 }}>
                                <Title style={styles.header}>{I18n.t(keys.SarViewer.Main.lblTitle)}</Title>
                            </Body>
                        </Header>
                        <BreadCrumb
                            isConnected={isConnected}
                            previousItem={previousItem}
                            currentItem={currentItem}
                        />
                        {_.isEmpty(this.state.data) && !isLoadingContent ? (
                            <View style={styles.centerView}>
                                <Text style={{ color: '#BDBDBD' }}>There is no content</Text>
                            </View>
                        ) : (
                                <ScrollView
                                    style={styles.container}
                                    contentContainerStyle={styles.contentContainer}
                                    ref={(ref) => this.scrollView = ref}
                                    refreshControl={
                                        <RefreshControl
                                            style={{ backgroundColor: '#E0FFFF' }}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.handleRefresh}
                                        />
                                    }
                                >
                                    <Placeholder
                                        animation="fade"
                                        isReady={refreshing ? !refreshing : !isLoadingContent}
                                        whenReadyRender={() => this.renderContent(this.state.data)}
                                    >
                                        {Array.from({ length: _.random(10, 15) }, () => _.random(30, 100)).map((item) => (
                                            <Line key={_.uniqueId('view')} width={`${item}%`} />
                                        ))}
                                    </Placeholder>
                                </ScrollView>
                            )}
                    </Container>
                </SideMenu>
            )
        }
        return (
            <Container onLayout={this.onLayout}>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                >
                    <TouchableOpacity style={styles.menuButton} onPress={() => Actions.drawerOpen()}>
                        <Icon name={AppCommon.icon("menu")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={styles.header}>{I18n.t(keys.SarViewer.Main.lblTitle)}</Title>
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
                            <ScrollView
                                style={styles.container}
                                contentContainerStyle={styles.contentContainer}
                                refreshControl={
                                    <RefreshControl
                                        style={{ backgroundColor: '#E0FFFF' }}
                                        refreshing={refreshingTree}
                                        onRefresh={this.handleRefreshTree}
                                    />
                                }
                            >
                                <Placeholder
                                    animation="fade"
                                    isReady={refreshingTree ? !refreshingTree : !isLoading}
                                    whenReadyRender={() => (
                                        <TreeView
                                            ref={ref => (this.treeView = ref)}
                                            data={dataTree}
                                            idKey="internalId"
                                            renderItem={this.renderItem}
                                            onItemPress={this.handleClick}
                                        />
                                    )}
                                >
                                    {Array.from({ length: _.random(5, 10) }, () => _.random(30, 100)).map((item) => (
                                        <Line key={_.uniqueId('view')} width={`${item}%`} />
                                    ))}
                                </Placeholder>
                            </ScrollView>
                        </Col>
                        <Col
                            style={{
                                width: contentWidth,
                                borderTopWidth: 1,
                                borderTopWidth: 1,
                                borderTopColor: 'gray',
                            }}
                        >

                            {_.isEmpty(this.state.data) && !isLoadingContent ? (
                                <View style={styles.centerView}>
                                    <Text style={{ color: '#BDBDBD' }}>{I18n.t(keys.Common.lblNoContent)}</Text>
                                </View>
                            ) : (

                                    <ScrollView
                                        style={styles.container}
                                        contentContainerStyle={styles.contentContainer}
                                        ref={(ref) => this.scrollView = ref}
                                        refreshControl={
                                            <RefreshControl
                                                style={{ backgroundColor: '#E0FFFF' }}
                                                refreshing={this.state.refreshing}
                                                onRefresh={this.handleRefresh}
                                            />
                                        }
                                    >
                                        <Placeholder
                                            animation="fade"
                                            isReady={refreshing ? !refreshing : !isLoadingContent}
                                            whenReadyRender={() => this.renderContent(this.state.data)}
                                        >
                                            {Array.from({ length: _.random(10, 15) }, () => _.random(30, 100)).map((item) => (
                                                <Line key={_.uniqueId('view')} width={`${item}%`} />
                                            ))}
                                        </Placeholder>
                                    </ScrollView>
                                )}
                        </Col>
                    </Row>
                </Grid>
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
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        alignSelf: 'center',
        color: 'white'
    },
    headerMoreButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
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


