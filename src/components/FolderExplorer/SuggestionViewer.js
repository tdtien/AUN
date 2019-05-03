import React, { Component } from 'react';
import {
    Text,
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
} from 'native-base';
import { AppCommon } from '../../commons/commons';
import { Actions } from 'react-native-router-flux';
import SuggestionItem from "./SuggestionItem";
import { connect } from 'react-redux';
import DownloadButton from './DownloadButton';
import { setDirectoryInfo } from "../../actions/directoryAction";
import { createDirectoryTreeWith, downloadAllEvidences } from '../../commons/utilitiesFunction';
import Loader from '../Loader/Loader'
import { downloadSuggestion } from '../../api/directoryTreeApi';

class SuggestionViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            refreshing: false,
            isShowFooter: false,
            choosenSuggestionItem: {}
        };
    }

    renderItem(item) {
        return (
            <SuggestionItem
                item={item}
                sType={this.props.sType}
                flow={this.props.flow}
                isConnected={this.props.isConnected}
                parentView={this}
            />
        )
    }

    handleShowFooter = (choosenSuggestionItem) => {
        this.setState({
            isShowFooter: true,
            choosenSuggestionItem: choosenSuggestionItem
        })
    }

    handleDownloadItem = () => {
        this.setState({
            isLoading: true,
        })
        downloadSuggestion(this.props.token, this.state.choosenSuggestionItem.id)
            .then((responseJson) => {
                // console.log('responseJson: ' + JSON.stringify(responseJson.data));
                let downloadFlow = {
                    sarInfo: this.props.sarInfo,
                    criterionInfo: this.props.criterionInfo,
                    subCriterionInfo: this.props.subCriterionInfo,
                    suggestionInfo: this.state.choosenSuggestionItem,
                    suggestionType: this.props.sType
                }
                let directoryTree = createDirectoryTreeWith(downloadFlow, responseJson.data, 'suggestion');
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
                            downloadItemType: 'suggestion',
                            downloadFlow: downloadFlow
                        }
                        // console.log('responseJson suggestion: ' + JSON.stringify(directoryInfo));
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
        let type = this.props.sType;
        let title = '';
        if (type === "evidences") {
            title = "All Evidence Types";
        } else {
            title = "All " + type.charAt(0).toUpperCase() + type.slice(1);
        }
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
                        <Title style={{ alignSelf: "center", color: 'white' }}>{title}</Title>
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
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.popTo('criterionViewer')}>
                        <Icon name="right" type="AntDesign" style={{ color: 'gray', fontSize: 15 }} />
                        <Text style={{ color: 'gray' }}>{this.props.sarInfo.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.popTo('subCriterionViewer')}>
                        <Icon name="right" type="AntDesign" style={{ color: 'gray', fontSize: 15 }} />
                        <Text style={{ color: 'gray' }}>{this.props.criterionInfo.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Actions.popTo('suggestionTypeViewer')}>
                        <Icon name="right" type="AntDesign" style={{ color: 'gray', fontSize: 15 }} />
                        <Text style={{ color: 'gray' }}>{this.props.subCriterionInfo.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} disabled>
                        <Icon name="right" type="AntDesign" style={{ color: 'gray', fontSize: 15 }} />
                        <Text style={{ color: AppCommon.colors }}>{this.props.suggestionInfo.name}</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Content
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                >
                    {
                        (this.props.data === undefined || this.props.data.length === 0) ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: '#BDBDBD' }}>There is no content</Text>
                            </View>
                        ) : (
                                <FlatList
                                    data={this.props.data}
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

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionViewer);

const styles = StyleSheet.create({
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
});