import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ScrollView
} from 'react-native';
import {
    Content,
    Container,
    Icon,
    Header,
    Body,
    Title,
    Button,
    Text
} from 'native-base';
import { getAllCriterions, downloadCriterion } from '../../api/directoryTreeApi';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader'
import { Actions } from 'react-native-router-flux';
import { AppCommon } from '../../commons/commons';
import FolderItem from './FolderItem'
import DownloadButton from "./DownloadButton";
import { setDirectoryInfo } from "../../actions/directoryAction";
import { createDirectoryTreeWith, downloadAllEvidences } from '../../commons/utilitiesFunction';

class CriterionViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            data: null,
            isShowFooter: false,
            choosenCriterionItem: {}
        };
    }

    componentDidMount() {
        this._getAll();
    }

    detail(item) {
        var props = {
            sarInfo: this.props.sarInfo,
            criterionInfo: item,
            isConnected: this.props.isConnected,
            offlineCriterionData: this.state.data
        }
        Actions.subCriterionViewer(props);
    }

    _getAll = () => {
        if (this.props.isConnected) {
            getAllCriterions(this.props.token, this.props.sarInfo.id)
                .then((responseJson) => {
                    // console.log('responseJson: ' + responseJson.data[0].name);
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
            let offlineCriterionData = this.props.offlineSarInfo.find(item => item.id === this.props.sarInfo.id);
            this.setState({
                isLoading: false,
                refreshing: false,
                data: offlineCriterionData.criterions
            })
        }

    }

    handleRefresh = () => {
        this.setState(
            {
                refreshing: true
            },
            () => {
                this._getAll();
            }
        );
    };

    renderItem({ item }) {
        return (
            <FolderItem
                item={item}
                parentView={this}
            />
        )
    }

    handleShowFooter = (choosenCriterionItem) => {
        this.setState({
            isShowFooter: true,
            choosenCriterionItem: choosenCriterionItem
        })
    }

    handleDownloadItem = () => {
        this.setState({
            isLoading: true,
        })
        downloadCriterion(this.props.token, this.state.choosenCriterionItem.id)
            .then((responseJson) => {
                let downloadFlow = {
                    sarInfo: this.props.sarInfo,
                    criterionInfo: this.state.choosenCriterionItem
                }
                let directoryTree = createDirectoryTreeWith(downloadFlow, responseJson.data, 'criterion');
                // console.log('directoryTree: ' + JSON.stringify(directoryTree));
                let pdfFolderPath = AppCommon.directoryPath + AppCommon.pdf_dir + '/' + this.props.email;
                downloadAllEvidences(directoryTree, pdfFolderPath)
                    .then(response => {
                        this.setState({
                            isLoading: false,
                            refreshing: false,
                            isShowFooter: false
                        })
                        var directoryInfo = {
                            email: this.props.email,
                            directoryTree: response,
                            downloadItemType: 'criterion',
                            downloadFlow: downloadFlow
                        }
                        // console.log('responseJson criterion: ' + JSON.stringify(directoryInfo));
                        this.props.setDirectoryInfo(directoryInfo);
                    }).catch(error => {
                        this.setState({
                            isLoading: false,
                            refreshing: false,
                            isShowFooter: false
                        })
                        console.log('Error when download: ' + error);
                    })
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                })
                console.error('Error when download: ' + error);
            });
    }

    render() {
        let leftHeaderButton = (this.state.isShowFooter) ? (
            <TouchableOpacity style={styles.menuButton} onPress={() => {
                this.setState({
                    isShowFooter: false
                })
            }} >
                <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
            </TouchableOpacity>
        ) : (
                <TouchableOpacity style={styles.menuButton} onPress={() => Actions.pop()} >
                    <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                </TouchableOpacity>
            )
        let footer = (this.state.isShowFooter) ?
            (
                <DownloadButton
                    parentView={this}
                />
            ) : null
        return (
            <Container style={{ backgroundColor: AppCommon.background_color }}>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                    rounded
                >
                    {
                        leftHeaderButton
                    }
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center", color: 'white' }}>All Criterions</Title>
                    </Body>
                    <TouchableOpacity style={styles.menuButton} onPress={() => null} >
                        <Icon name={AppCommon.icon("more")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                </Header>
                <ScrollView
                    style={{ maxHeight: 40 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        this.scrollView.scrollToEnd({ animated: true });
                    }}
                >
                    <TouchableOpacity style={styles.menuButton} onPress={() => Actions.popTo('_sarViewer')}>
                        <Icon name={AppCommon.icon("tv")} type="Ionicons" style={{ color: 'gray', fontSize: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} disabled>
                        <Icon name="right" type="AntDesign" style={{ color: 'gray', fontSize: 20 }} />
                        <Text style={{ color: AppCommon.colors }}>{this.props.sarInfo.name}</Text>
                    </TouchableOpacity>
                </ScrollView>
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
                                    renderItem={this.renderItem.bind(this)}
                                    onRefresh={this.handleRefresh}
                                    refreshing={this.state.refreshing}
                                    onEndReached={this.handleLoadMore}
                                    onEndReachedThreshold={50}
                                />
                            )
                    }
                </Content>
                {
                    footer
                }
                <Loader loading={this.state.isLoading} />
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.account.token,
        email: state.account.email,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setDirectoryInfo: item => {
            dispatch(setDirectoryInfo(item));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CriterionViewer);

const styles = StyleSheet.create({
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
});