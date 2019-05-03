import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    FlatList
} from 'react-native';
import {
    Content,
    Container,
    Icon,
    Header,
    Body,
    Title,
} from 'native-base';
import { getAllEvidences } from '../../api/directoryTreeApi';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader'
import { Actions } from 'react-native-router-flux';
import { AppCommon } from '../../commons/commons';
import EvidenceItem from './EvidenceItem';
import { setDirectoryInfo } from "../../actions/directoryAction";
import { createDirectoryTreeWith, createFolder, downloadAllEvidences } from '../../commons/utilitiesFunction';
import DownloadButton from './DownloadButton';
import RNFS from "react-native-fs";

class EvidenceViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            data: null,
            isShowFooter: false,
            choosenEvidenceItem: {}
        };
    }

    componentDidMount() {
        this._getAll();
    }

    componentWillReceiveProps(props) {
        this.handleRefresh();
    }

    _getAll = () => {
        if (this.props.isConnected) {
            getAllEvidences(this.props.token, this.props.suggestionInfo.id)
                .then((responseJson) => {
                    // console.log('data: ' + responseJson.data);
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
                data: this.props.offlineSuggestionData.evidences
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

    renderItem(item, index) {
        return (
            <EvidenceItem
                item={item}
                parentView={this}
            />
        )
    }

    handleShowFooter = (choosenEvidenceItem) => {
        this.setState({
            isShowFooter: true,
            choosenEvidenceItem: choosenEvidenceItem
        })
    }

    handleDownloadItem = () => {
        this.setState({
            isLoading: true,
        })
        let downloadFlow = {
            sarInfo: this.props.sarInfo,
            criterionInfo: this.props.criterionInfo,
            subCriterionInfo: this.props.subCriterionInfo,
            suggestionInfo: this.props.suggestionInfo,
            evidenceInfo: this.state.choosenEvidenceItem
        }
        let directoryTree = createDirectoryTreeWith(downloadFlow, this.state.choosenEvidenceItem, 'evidence');
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
                    downloadItemType: 'evidence',
                    downloadFlow: downloadFlow
                }
                // console.log('responseJson evidence: ' + JSON.stringify(directoryInfo));
                this.props.setDirectoryInfo(directoryInfo);
            }).catch(error => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                    isShowFooter: false
                })
                console.log('Error when download: ' + error);
            })
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
            ) : (
                <TouchableOpacity style={styles.addButton} onPress={() => Actions.merchant({ flow: this.props })}>
                    <Icon name={AppCommon.icon("add")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                </TouchableOpacity>
            )
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
                        <Title style={{ alignSelf: "center", color: 'white' }}>All Evidences</Title>
                    </Body>
                    <TouchableOpacity style={styles.menuButton} onPress={() => null} >
                        <Icon name={AppCommon.icon("more")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                </Header>
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
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => this.renderItem(item, index)}
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

export default connect(mapStateToProps, mapDispatchToProps)(EvidenceViewer);

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
    }
});