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
            data: {},
            currentItem: {},
            previousItem: [],
            position: 10
        }

        this.sarCache = new Cache({
            namespace: "sarViewerCache",
            policy: {
                maxEntries: 50000
            },
            backend: AsyncStorage
        });
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
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
    }

    makeRemoteRequest = async (item) => {
        const { token } = this.props
        getContentSar(token, item.id)
            .then(response => {
                if (response && response.success) {
                    this.setState({
                        isLoadingContent: false,
                        refreshing: false,
                        data: response.data || [],
                        dataTree: this.state.dataTree
                    }, () => {
                        this.sarCache.setItem(`${item.key}${item.id}`, this.state.data, (error) => {
                            if (error) {
                                console.error(error)
                            }
                        })
                    })
                } else {
                    this.setState({ isLoadingContent: false, refreshing: false, data: [] })
                }
            })
            .catch(error => {
                this.setState({ isLoadingContent: false, refreshing: false, data: [] })
                console.error(error)
            })
    }

    generateIndex = (item, rootIndex) => {
        return item.children && item.children.forEach((child, index) => {
            child.index = `${rootIndex}.${index + 1}`
            child.internalId = _.uniqueId('tree_')
            this.generateIndex(child, child.index)
        });
    }

    makeRemoteRequestTree = async () => {
        const { token } = this.props;
        getContentAllSar(token)
            .then(responeJson => {
                if (responeJson && responeJson.success) {
                    // console.log(responeJson.data)
                    responeJson.data.forEach((element) => {
                        element.index = element.id
                        element.internalId = _.uniqueId('tree_')
                        this.generateIndex(element, element.id)
                    })
                    this.setState({
                        dataTree: responeJson.data || [],
                        isLoading: false,
                    })
                } else {
                    this.setState({
                        isLoading: false,
                        dataTree: []
                    })
                }
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    dataTree: []
                })
                console.error(error)
            })
    }

    handleConnectivityChange = (isConnected) => {
        this.setState({ isConnected: isConnected }, () => this.handleFetchData())
    };

    handleRefresh = () => {
        this.setState({ refreshing: true }, () => this.handleRequest(this.state.currentItem, true));
    }

    handleRequest = (item = {}, isRefresh = false) => {
        if (this.state.isConnected) {
            if (isRefresh) {
                this.makeRemoteRequest(item)
            } else {
                this.sarCache.getItem(`${item.key}${item.id}`, (error, value) => {
                    if (error) {
                        console.error(error)
                    }
                    if (value) {
                        this.setState({ isLoadingContent: false, refreshing: false, data: value })
                    } else {
                        this.makeRemoteRequest(item)
                    }
                })
            }
        } else {
            this.sarCache.getItem(`${item.key}${item.id}`, (error, value) => {
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
    }

    handleFetchData = () => {
        this.setState({
            isLoading: true,
            currentItem: {},
            previousItem: [],
            dataTree: []
        }, () => {
            if (this.state.isConnected) {
                this.makeRemoteRequestTree()
            } else {
                if (isAlert) {
                    Alert.alert(I18n.t(keys.Common.alertError), I18n.t(keys.Common.alertNetworkRequestFail),
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

    handleClick = (item, level) => {
        const { currentItem } = this.state
        if (item.key === 'sar') {
            if (!_.isEmpty(currentItem) && item.key !== currentItem.key && item.id !== currentItem.id) {
                this.setState({ isLoadingContent: true, position: 10, currentItem: item }, () => this.handleRequest(item))
            } else {
                this.setState({ isLoadingContent: true, position: 10, currentItem: item }, () => this.handleRequest(item))
            }
        }
        if (item.offSet) {
            this.scrollView.scrollTo({ x: 0, y: item.offSet, animated: true })
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
        let { width } = event.nativeEvent.layout
        if (Math.floor(width) !== Math.floor(this.state.width)) {
            this.setState({ treeWidth: width * 1 / 3, contentWidth: width * 2 / 3 })
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
                    )} style={{ paddingRight: 5, color: item.commentCount > 0 ? AppCommon.colors : '#cccccc', fontSize: 13 }} />
                    <Text style={{ color: 'black' }}>{`${item.index}. ${item.name}`}</Text>
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
                        onPress={() => Actions.comment({ subCriterionInfo: item })}
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
            refreshing
        } = this.state
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
                            <ScrollView
                                style={styles.container}
                                contentContainerStyle={styles.contentContainer}
                            >
                                <Placeholder
                                    animation="shine"
                                    isReady={!isLoading}
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
                                            animation="shine"
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

