import _ from 'lodash';
import { Body, Col, Container, Grid, Header, Icon, Row, Title } from "native-base";
import React, { Component } from "react";
import { RefreshControl, Alert, Dimensions, Linking, NetInfo, ScrollView, StyleSheet, Text, TouchableOpacity, View, AsyncStorage } from "react-native";
import TreeView from 'react-native-final-tree-view';
import HTML from 'react-native-render-html';
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';
import Placeholder, { Line } from "rn-placeholder";
import { getContentAllSar, getContentSar } from "../../api/directoryTreeApi";
import { AppCommon } from "../../commons/commons";
import { _searchTree } from "../../commons/utilitiesFunction";
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';
import BreadCrumb from "../Breadcrumb/Breadcrumb";
import { Cache } from "react-native-cache";
import SideMenu from "react-native-side-menu";

const window = Dimensions.get('window');

class SarViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataTree: [],
            treeWidth: window.width * 1 / 3,
            contentWidth: window.width * 2 / 3,
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
        getContentSar(token, item.id)
            .then(response => {
                if (response && response.success) {
                    this.mounted && this.setState({
                        isLoadingContent: false,
                        refreshing: false,
                        data: response.data || []
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
        getContentAllSar(token)
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
                            this.setState({ data: value }, () => {
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
                treeWidth: width * 1 / 3,
                contentWidth: width * 2 / 3,
                isTablet: height / width < 1.6
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
                    )} style={{ paddingRight: 5, color: item.commentCount > 0 ? AppCommon.colors : '#cccccc', fontSize: 20 }} />
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
        return items.map((item, index) => (
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
                    <View onLayout={({ nativeEvent }) => {
                        this.state.position += nativeEvent.layout.height
                    }}>
                        <HTML
                            html={item.content}
                            imagesMaxWidth={this.state.contentWidth}
                            onLinkPress={(evt, href) => Linking.openURL(href)}
                            baseFontStyle={{ color: 'black' }}
                        />
                    </View>
                }
                {item.children && this.renderChildren(item.children, `${rootIndex}.${index + 1}`)}
            </View>
        ))
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
                    edgeHitWidth={this.state.width}
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
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
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


