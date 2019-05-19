import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    TouchableNativeFeedback,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Alert,
    Dimensions,
    TextInput,
    Keyboard,
    RefreshControl,
} from 'react-native';
import {
    Content,
    Container,
    Icon,
    Header,
    Body,
    Title,
    Footer,
    View
} from 'native-base';
import { AppCommon } from '../../commons/commons';
import { Actions } from 'react-native-router-flux';
import moment from "moment";
import { connect } from 'react-redux';
import { getAllComments, getAllNotes, addComment } from '../../api/accountApi';

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
            fullContent: false,
            activeTabIndex: 0,
            message: '',
            comments: [],
            notes: []
        };
    }

    componentDidMount() {
        this.makeRemoteRequest();
    }

    handleGetComments = (scrollToEnd = false) => {
        const { token, subCriterionInfo } = this.props;
        console.log('subCriterionInfo: ' + JSON.stringify(subCriterionInfo));
        getAllComments(token, subCriterionInfo.id)
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                    comments: responseJson.data
                },
                    () => { scrollToEnd ? setTimeout(() => this._content._root.scrollToEnd({ animated: true }), 200) : null }
                )
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                })
                console.error('Error: ' + error);
                Alert.alert('Error when get comments: ' + error);
            });
    }

    handleGetNotes = (scrollToEnd = false) => {
        const { token, subCriterionInfo } = this.props;
        getAllNotes(token, subCriterionInfo.id)
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                    notes: responseJson.data
                },
                    () => { scrollToEnd ? setTimeout(() => this._content._root.scrollToEnd({ animated: true }), 200) : null }
                )
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                })
                console.error('Error: ' + error);
                Alert.alert('Error when get notes: ' + error);
            });
    }

    makeRemoteRequest = () => {
        const { token, subCriterionInfo } = this.props;
        this.handleGetComments();
        this.handleGetNotes();
    }

    toggleContent = () => {
        Keyboard.dismiss();
        this.setState({
            fullContent: !this.state.fullContent
        });
    }

    handleRefresh = () => {
        this.setState({
            refreshing: true
        }, () => this.makeRemoteRequest());
    };

    renderItem = ({ item }) => {
        return (
            <View style={{ backgroundColor: '#f2f2f2', marginBottom: 10, marginHorizontal: 10, padding: 10, borderRadius: 5 }}>
                {item.isNote === 0 ? <Text style={[styles.text, { fontSize: 17, fontWeight: 'bold' }]}>{item.userEmail}</Text> : null}
                <Text style={[styles.text, { fontSize: 17 }]}>{item.content}</Text>
                <Text style={[styles.text, { fontSize: 14, marginTop: 3 }]}>{moment(item.updatedAt).format('DD/MM/YYYY HH:mm')}</Text>
            </View>
        )
    }

    handleSendMessage = () => {
        const { message, activeTabIndex } = this.state
        if (message === '') {
            Alert.alert('Error', activeTabIndex === 0 ? 'Empty comment!' : 'Empty note!');
            return;
        }
        Keyboard.dismiss();
        this.setState({
            isLoading: true,
        })
        let data = {
            "content": message,
            "isNote": activeTabIndex,
            "subCriterionId": this.props.subCriterionInfo.id,
            "email": this.props.email,
        }
        addComment(this.props.token, data)
            .then((result) => {
                this.setState({
                    isLoading: false
                }, () => {
                    activeTabIndex === 0 ? this.handleGetComments(true) : this.handleGetNotes(true)
                });
            })
            .catch((error) => {
                console.log('Error: ' + error);
                Alert.alert('Error when add comment: ' + error);
            })
        this.setState({
            message: ''
        })
    }

    changeActiveTab = (index) => {
        if (this.state.activeTabIndex !== index) {
            this.setState({
                activeTabIndex: index,
                message: ''
            })
        }
    }

    render() {
        const { fullContent, activeTabIndex, isLoading, comments, notes } = this.state;
        let content = this.props.subCriterionInfo.content;
        let marginHorizontal = 10;
        let iconSize = 35;
        let messageWidth = Dimensions.get('window').width - marginHorizontal * 3 - iconSize;
        return (
            <Container style={{ backgroundColor: 'white' }}>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                >
                    <TouchableOpacity style={styles.menuButton} onPress={() => Actions.pop()} >
                        <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center", color: 'white' }}>Comment</Title>
                    </Body>
                </Header>
                <Content
                    style={{ flex: 1 }}
                    ref={ref => this._content = ref}
                    refreshControl={
                        <RefreshControl
                            style={{ backgroundColor: '#E0FFFF', }}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                        />
                    }
                >
                    <TouchableNativeFeedback onPress={() => this.toggleContent()}>
                        {
                            (fullContent || content.length <= 300) ? (
                                <View style={styles.content} >
                                    <Text style={styles.text} >{content}</Text>
                                </View>
                            ) : (
                                    <View style={styles.content}>
                                        <Text style={styles.text}>{content.substring(0, 300)}</Text>
                                        <Text style={[styles.text, { color: '#8c8c8c' }]}>... Xem thêm</Text>
                                    </View>
                                )
                        }
                    </TouchableNativeFeedback>
                    <View
                        style={{ flex: 1, flexDirection: 'row', marginBottom: 10, borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#e6e6e6', height: 50 }}
                    >
                        <TouchableOpacity style={activeTabIndex === 0 ? styles.activeTab : styles.tab} onPress={() => this.changeActiveTab(0)}>
                            <Text style={activeTabIndex === 0 ? styles.activeText : styles.text}>Comment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={activeTabIndex === 1 ? styles.activeTab : styles.tab} onPress={() => this.changeActiveTab(1)}>
                            <Text style={activeTabIndex === 1 ? styles.activeText : styles.text}>Note</Text>
                        </TouchableOpacity>
                    </View>
                    {isLoading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" animating color={AppCommon.colors} />
                        </View>
                    ) : (
                            <FlatList
                                data={activeTabIndex === 0 ? comments : notes}
                                extraData={activeTabIndex === 0 ? comments : notes}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderItem}
                            />
                        )}
                </Content>
                <Footer
                    style={{ backgroundColor: 'white', borderTopWidth: 1, borderColor: '#d9d9d9' }}
                >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: marginHorizontal, paddingVertical: 6 }}>
                        <TextInput
                            style={{ borderColor: 'gray', borderWidth: 1, width: messageWidth, marginRight: marginHorizontal, borderRadius: 20, paddingHorizontal: 15, fontSize: 17 }}
                            placeholder={activeTabIndex === 0 ? 'Add comment...' : 'Add note...'}
                            onChangeText={(message) => this.setState({ message: message })}
                            value={this.state.message}
                            returnKeyType="done"
                        />
                        <TouchableOpacity onPress={() => this.handleSendMessage()}>
                            <Icon name={AppCommon.icon("send")} style={{ color: AppCommon.colors, fontSize: iconSize }} />
                        </TouchableOpacity>
                    </View>
                </Footer>
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

export default connect(mapStateToProps, null)(Comment);

const styles = StyleSheet.create({
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    content: {
        marginVertical: 15,
        paddingHorizontal: 15,
    },
    text: {
        fontSize: 20.5,
        textAlign: 'justify',
        color: '#404040',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    activeTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 5,
        borderBottomColor: AppCommon.colors
    },
    activeText: {
        fontSize: 20.5,
        textAlign: 'justify',
        fontWeight: 'bold',
        color: AppCommon.colors,
    }
});