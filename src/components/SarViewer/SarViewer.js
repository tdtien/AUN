import { Body, Container, Header, Icon, Title, Grid, Col, Row } from "native-base";
import React, { Component } from "react";
import { Text, ActivityIndicator, Alert, Dimensions, ScrollView, NetInfo, StyleSheet, TouchableOpacity, View, Linking } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from 'react-redux';
import { getContentSar, getContentAllSar } from "../../api/directoryTreeApi";
import { isEmptyJson, _searchTree, limitText, getRandomArbitrary } from "../../commons/utilitiesFunction";
import { AppCommon } from "../../commons/commons";
import BreadCrumb from "../Breadcrumb/Breadcrumb";
import HTML from 'react-native-render-html';
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';
import TreeView from 'react-native-final-tree-view'
import _ from 'lodash'

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
            data: {},
            currentItem: {},
            previousItem: [],
            position: 0
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

    makeRemoteRequest = async (item) => {
        const { token } = this.props
        getContentSar(token, item.id)
            .then(response => {
                if (response && response.success) {
                    this.setState({
                        isLoadingContent: false,
                        data: response.data || [],
                        dataTree: this.state.dataTree
                    })
                } else {
                    this.setState({ isLoadingContent: false, data: [] })
                }
            })
            .catch(error => {
                this.setState({ isLoadingContent: false, data: [] })
                console.error(error)
            })
    }

    generateIndex = (item, rootIndex) => {
        return item.children && item.children.forEach((child, index) => {
            child.index = `${rootIndex}.${index + 1}`
            child.shortName = limitText(child.name || child.content, Math.floor(this.state.treeWidth / 8))
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
                        element.shortName = limitText(element.name || element.content, Math.floor(this.state.treeWidth / 8))
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
        // let fileType = ['IMPLICATION', 'QUESTION', 'FILE', 'LINK']
        // if (item.name === 'Loading...' || (item.hasOwnProperty('type') && fileType.indexOf(item.type) >= 0)) {
        //     return;
        // }
        // const { token } = this.props;
        // let maxWidth = Math.floor(this.state.treeWidth / 8)
        // if (isEmptyJson(item)) {
        //     //Loading first-time
        //     type = 'sars'
        //     getDataSar(token, type)
        //         .then(responseJson => {
        //             var itemList = isEmptyJson(responseJson) ?
        //                 [] : responseJson.data.map(item => ({
        //                     ...item,
        //                     id: `${type}${item.id}`,
        //                     itemId: item.id,
        //                     isLoad: false,
        //                     children: [{
        //                         id: getRandomArbitrary(1, 99),
        //                         name: 'Loading...'
        //                     }]
        //                 }));
        //             this.setState({
        //                 isLoading: false,
        //                 refreshing: false,
        //                 dataTree: itemList
        //             })
        //         })
        // } else {
        //     let type = getNextType(item.id.replace(/[^a-zA-Z]/g, ''));
        //     var id = item.id
        //     if (typeof item.id === 'string') {
        //         id = item.id.replace(/[^0-9]/g, '');
        //     }
        //     if (type === '') {
        //         return
        //     }
        //     if (type === 'suggestions') {
        //         item.children = item.dataSuggestions[item.id.replace(/[^a-zA-Z]/g, '')]
        //             .map(element => ({
        //                 ...element,
        //                 id: `${type}${element.id}`,
        //                 itemId: element.id,
        //                 isLoad: false,
        //                 name: element.hasOwnProperty('name') ?
        //                     limitText(element.name, maxWidth) :
        //                     limitText(element.content, maxWidth)
        //             }))
        //         if (item.id.includes('evidences')) {
        //             item.children = item.children.map(element => ({
        //                 ...element,
        //                 children: [{ id: getRandomArbitrary(1, 99), name: 'Loading...' }]
        //             }));
        //         }
        //         this.forceUpdate();
        //         return
        //     }
        //     getDataSar(token, type, id)
        //         .then(responseJson => {
        //             if (type === 'suggestionTypes') {
        //                 getDataSar(token, 'subCriterions', id)
        //                     .then(response => {
        //                         let data = [
        //                             { id: `implications${getRandomArbitrary(1, 99)}`, name: 'Implications' },
        //                             { id: `questions${getRandomArbitrary(1, 99)}`, name: 'Questions' },
        //                             { id: `evidences${getRandomArbitrary(1, 99)}`, name: 'Evidence Types' },
        //                             { id: `subCriterions${getRandomArbitrary(1, 99)}`, name: 'Subcriterions' }
        //                         ]
        //                         responseJson.data.subCriterions = response.data;
        //                         item.children = data.map(item => ({
        //                             ...item,
        //                             isLoad: false,
        //                             dataSuggestions: responseJson.data,
        //                             children: [{ id: getRandomArbitrary(1, 99), name: 'Loading...' }]
        //                         }))
        //                         this.forceUpdate();
        //                     })
        //             } else if (item.hasOwnProperty('type') && item.type === 'EVIDENCE') {
        //                 item.children = isEmptyJson(responseJson) ?
        //                     [] : responseJson.data.map(item => ({
        //                         ...item,
        //                         id: `${type}${item.id}`,
        //                         itemId: item.id,
        //                         isLoad: false,
        //                         name: limitText(item.name, maxWidth)
        //                     }))
        //             } else {
        //                 item.children = isEmptyJson(responseJson) ?
        //                     [] : responseJson.data.map(item => ({
        //                         ...item,
        //                         id: `${type}${item.id}`,
        //                         itemId: item.id,
        //                         isLoad: false,
        //                         name: limitText(item.name, maxWidth),
        //                         children: [{ id: getRandomArbitrary(1, 99), name: 'Loading...' }]
        //                     }))
        //             }
        //             this.forceUpdate();
        //         })
        // }
    }

    handleConnectivityChange = (isConnected) => {
        this.setState({ isConnected: isConnected }, () => this.handleFetchData())
    };

    handleFetchData = (isAlert = true) => {
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
        // var { currentItem, previousItem } = this.state;
        // if (!item.isLoad) {
        //     this.makeRemoteRequestTree(item)
        //     item.isLoad = true;
        // }
        if (item.key === 'sar') {
            this.setState({ isLoadingContent: true }, () => this.makeRemoteRequest(item))
        }
        if (item.offSet) {
            console.log('item.offSet', item.offSet)
            this.scrollView.scrollTo({ x: 0, y: item.offSet, animated: true })
        }
        // previousItem = []
        // currentItem = {}
        // for (var i = 0; i < routes.length; i++) {
        //     const route = routes[i];
        //     var listResult = _searchTree(this.state.dataTree, node => node.id === route.id && node.name === route.name)
        //     if (listResult.length > 0) {
        //         if (i === routes.length - 1) {
        //             currentItem = listResult[0];
        //         } else {
        //             previousItem.push(listResult[0]);
        //         }
        //         this.setState({ currentItem: currentItem, previousItem: previousItem })
        //     }
        // }
    }

    renderItem = (item, level) => {
        return (
            <View>
                <Text
                    style={{
                        marginLeft: 25 * level,
                    }}
                >
                    {item.collapsed !== null ? (
                        <Text>{item.collapsed ? ' > ' : ' \\/ '}</Text>
                    ) : (
                            <Text> - </Text>
                        )}
                    {item.name}
                </Text>
            </View>
        )
    }

    renderContent = (data) => {
        return (
            <View
                style={{ flex: 1 }}
            >
                <Text
                    ref={`${data.key}${data.id}`}
                    onLayout={({ nativeEvent }) => {
                        this.refs[`${data.key}${data.id}`].measure((x, y, width, height, pageX, pageY) => {
                            this.putOffSet(data)
                            this.state.position += height
                        })
                    }}
                    style={{ fontSize: 25, alignSelf: 'center', fontWeight: 'bold' }}
                >{data.name}</Text>
                {data.children.map((item, index) => {
                    return (
                        <View
                            key={_.uniqueId()}
                        >
                            {item.name && <Text
                                ref={`${item.key}${item.id}`}
                                onLayout={({ nativeEvent }) => {
                                    this.refs[`${item.key}${item.id}`].measure((x, y, width, height, pageX, pageY) => {
                                        console.log(item.id, limitText(item.name || item.content), x, y, width, height, pageX, pageY);
                                        this.putOffSet(item, this.state.position)
                                        this.state.position += height
                                    })
                                }}
                                style={{ fontSize: 20, paddingLeft: 10, fontWeight: 'bold' }}>{`${data.id}.${index + 1}. ${item.name}`}</Text>}
                            {item.children && this.renderChildren(item.children, `${data.id}.${index + 1}`)}
                        </View>
                    )
                })}
            </View>
        )
    }

    putOffSet = (item, position = 0) => {
        let itemInTreeResult = _searchTree(this.state.dataTree, (node) => node.id === item.id && node.key === item.key)
        if (itemInTreeResult.length > 0) {
            var itemInTree = itemInTreeResult[0]
            itemInTree.offSet = position
        }
    }

    renderChildren = (items, rootIndex) => {
        return items.map((item, index) => (
            <View
                key={_.uniqueId()}
            >
                {item.name && <Text
                    ref={`${item.key}${item.id}`}
                    onLayout={({ nativeEvent }) => {
                        this.refs[`${item.key}${item.id}`].measure((x, y, width, height, pageX, pageY) => {
                            console.log(item.id, limitText(item.name || item.content), x, y, width, height, pageX, pageY);
                            this.putOffSet(item, this.state.position)
                            this.state.position += height
                        })
                    }}
                    style={{ fontSize: 16, paddingLeft: 10 }}>{`${rootIndex}.${index + 1}. ${item.name}`}</Text>}
                {item.key === 'subCriterion' && (item.commentCount > 0 || item.noteCount > 0) &&
                    <TouchableOpacity activeOpacity={0.8} style={{ alignSelf: 'flex-end' }} onPress={() => Actions.comment({ subCriterionInfo: item })}>
                        <Icon name={AppCommon.icon("chatboxes")}
                            style={{ color: AppCommon.colors, fontSize: AppCommon.icon_size - 10 }} />
                    </TouchableOpacity>
                }
                {item.content && <HTML
                    html={item.content}
                    imagesMaxWidth={Dimensions.get('window').width}
                    onLinkPress={(evt, href) => Linking.openURL(href)}
                />}
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
                                    <ActivityIndicator animating color={AppCommon.colors} />
                                </View>
                            ) : (
                                    <ScrollView
                                        style={styles.container}
                                        contentContainerStyle={styles.contentContainer}
                                    >
                                        <TreeView
                                            ref={ref => (this.treeView = ref)}
                                            data={dataTree}
                                            idKey="internalId"
                                            renderItem={this.renderItem}
                                            onItemPress={this.handleClick}
                                        />
                                    </ScrollView>
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

                            {isEmptyJson(this.state.data) ? (
                                isLoadingContent ? (
                                    <View style={styles.centerView}>
                                        <ActivityIndicator animating color={AppCommon.colors} />
                                    </View>
                                ) : (
                                        <View style={styles.centerView}>
                                            <Text style={{ color: '#BDBDBD' }}>There is no content</Text>
                                        </View>
                                    )
                            ) : (
                                    <ScrollView
                                        style={styles.container}
                                        contentContainerStyle={styles.contentContainer}
                                        ref={(ref) => this.scrollView = ref}
                                    >
                                        {this.renderContent(this.state.data)}
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


