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

class EvidenceViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            data: null
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

    handleOpenPdfFile = async (item) => {
        var prop = await { filePath: `data:application/pdf;base64,${item.dataBase64}`, fileName: item.name, base64: null, link: item.link, flow: null };
        this.setState({ isLoading: false }, Actions.pdfViewer(prop));
        // console.log('base64: ' + item.dataBase64);
        // console.log('token: ' + this.props.token);
        // let folderPath = AppCommon.directoryPath + AppCommon.pdf_dir;
        // let fileName = item.name;
        // let filePath = folderPath + "/" + fileName;
        // let that = this;
        // RNFS.exists(folderPath).then((response) => {
        //     if (!response) {
        //         RNFS.mkdir(folderPath).then((response) => {
        //             RNFS.writeFile(filePath, item.dataBase64, "base64")
        //                 .then(function (response) {
        //                     console.log('Pdf is saved');
        //                     Actions.pdfViewer({ filePath: `file://${filePath}`, fileName: fileName, base64: item.dataBase64, flow: null });
        //                 }).catch(function (error) {
        //                     console.log(error);
        //                 })
        //         })
        //     } else {
        //         RNFS.writeFile(filePath, item.dataBase64, "base64")
        //             .then(function (response) {
        //                 console.log('Pdf is saved');
        //                 Actions.pdfViewer({ filePath: `file://${filePath}`, fileName: fileName, base64: item.dataBase64, flow: null  });
        //             }).catch(function (error) {
        //                 console.log(error);
        //             })
        //     }
        // })
    }

    renderItem(item, index) {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => { this.setState({ isLoading: true }); this.handleOpenPdfFile(item) }}>
                <View style={styles.item}>
                    <View style={styles.leftItem}>
                        <Icon name='pdffile1' type="AntDesign" style={{ color: 'deepskyblue', fontSize: AppCommon.icon_largeSize }} />
                        <Text style={{ color: 'black', paddingHorizontal: 15, fontSize: AppCommon.font_size }} numberOfLines={3}>{item.name}</Text>
                    </View>
                    {/* <Icon name={AppCommon.icon('more')} style={{ color: 'gray', fontSize: AppCommon.icon_size }} /> */}
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <Container style={{ backgroundColor: AppCommon.background_color }}>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                    rounded
                >
                    <TouchableOpacity style={styles.menuButton} onPress={() => Actions.popTo('suggestionTypeViewer')} >
                        <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
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
                <TouchableOpacity style={styles.addButton} onPress={() => Actions.merchant({ flow: this.props })}>
                    <Icon name={AppCommon.icon("add")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                </TouchableOpacity>
                <Loader loading={this.state.isLoading} />
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.account.token,
    };
};

export default connect(mapStateToProps)(EvidenceViewer);

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
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ECE9E9',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    leftItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    }
});