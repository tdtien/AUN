import React, { Component } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    FlatList,
    View,
    Text
} from 'react-native';
import {
    Content,
    Container,
    Icon,
    Header,
    Body,
    Title,
    Footer,
    Right
} from 'native-base';
import { getAllSars, downloadSar } from '../../api/directoryTreeApi';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader'
import { Actions } from 'react-native-router-flux';
import { AppCommon } from '../../commons/commons';
import FolderItem from './FolderItem'
import { setDirectoryInfo } from "../../actions/directoryAction";

class SarViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            data: null,
            isShowFooter: false,
            directoryOffline: {},
            choosenSarId: ''
        };
    }

    componentDidMount() {
        this._getAll();
    }

    detail(sarId) {
        Actions.criterionViewer({ sarId: sarId });
    }

    _getAll = () => {
        getAllSars(this.props.token)
            .then((responseJson) => {
                // console.log('responseJson sar: ' + responseJson.data[0].name);
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

    handleShowFooter = (choosenSarId) => {
        this.setState({
            isShowFooter: true,
            choosenSarId: choosenSarId
        })
    }

    renderItem({ item }) {
        return (
            <FolderItem
                item={item}
                parentView={this}
            />
        )
    }

    handleDownloadItem = () => {
        this.setState({
            isLoading: true,
        })
        //this.state.choosenSarId
        downloadSar(this.props.token, this.state.choosenSarId)
            .then((responseJson) => {
                // console.log('responseJson sar: ' + responseJson.data[0].name);
                this.setState({
                    isLoading: false,
                    refreshing: false,
                    directoryOffline: responseJson.data
                })
                this.props.setDirectoryInfo({ email: this.props.email, directoryTree: responseJson.data});
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
                Actions.pop()
            }} >
                <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
            </TouchableOpacity>
        ) : (
                <TouchableOpacity style={styles.menuButton} onPress={() => Actions.drawerOpen()} >
                    <Icon name={AppCommon.icon("menu")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                </TouchableOpacity>
            )
        let footer = (this.state.isShowFooter) ?
            (
                <Footer
                    style={{ backgroundColor: AppCommon.colors }}
                >
                    <Right>
                        <View style={styles.footerButton}>
                            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => this.handleDownloadItem()} >
                                <Icon name={AppCommon.icon("cloud-download")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                            </TouchableOpacity>
                        </View>
                    </Right>
                </Footer>
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
                        <Title style={{ alignSelf: "center", color: 'white' }}>All Sars</Title>
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
        email: state.account.email
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SarViewer);

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