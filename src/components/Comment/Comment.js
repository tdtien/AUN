import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    TouchableNativeFeedback,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Alert,
    ScrollView,
    Dimensions,
    TextInput,
    Keyboard,
    RefreshControl
} from 'react-native';
import {
    Content,
    Container,
    Icon,
    Header,
    Body,
    Title,
    Tabs,
    Tab,
    Footer,
    Right,
    View
} from 'native-base';
import { AppCommon } from '../../commons/commons';
import { Actions } from 'react-native-router-flux';
import moment from "moment";
import { connect } from 'react-redux';
import { getAllComments, getAllNotes, addComment } from '../../api/accountApi';

let content = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.ontrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source'

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


    makeRemoteRequest = (scrollToEnd = false) => {
        const { token, subCriterionItem } = this.props;
        // console.log('token: ' + token);
        // console.log('subCriterionItem: ' + JSON.stringify(subCriterionItem));
        //subCriterionItem.id
        getAllComments(token, 1)
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                    comments: responseJson.data
                },
                    () => { scrollToEnd ? this._content._root.scrollToEnd({ animated: true }) : null }
                )
                // console.log('comments: ' + JSON.stringify(responseJson.data));
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                })
                console.error('Error: ' + error);
                Alert.alert('Error when get comments: ' + error);
            });
        getAllNotes(token, 1)
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                    notes: responseJson.data
                },
                    () => { scrollToEnd ? this._content._root.scrollToEnd({ animated: true }) : null }
                )
                // console.log('notes: ' + JSON.stringify(responseJson.data));
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
            <View style={{ backgroundColor: '#f2f2f2', marginTop: 10, marginHorizontal: 10, padding: 10, borderRadius: 5 }}>
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
        // this.setState({
        //     isLoading: true,
        // })
        let data = {
            "content": message,
            "isNote": activeTabIndex,
            // "subCriterionId": this.props.subCriterionItem.id,
            "subCriterionId": 1,
            "email": this.props.email,
        }
        addComment(this.props.token, data)
            .then((result) => {
                this.setState({
                    isLoading: false
                }, () => {
                    this.makeRemoteRequest(true);
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

    render() {
        const { fullContent, activeTabIndex, isLoading, comments, notes } = this.state;
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
                    contentContainerStyle={{ flexGrow: 1 }}
                    // scrollEnabled={true}
                    ref={ref => this._content = ref}
                    refreshControl={
                        <RefreshControl
                            style={{ backgroundColor: '#E0FFFF' }}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                        />
                    }
                >
                    <TouchableNativeFeedback onPress={() => this.toggleContent()}>
                        {
                            fullContent ? (
                                <View style={styles.textView} >
                                    <Text style={styles.text} >{content}</Text>
                                </View>
                            ) : (
                                    <View style={styles.textView}>
                                        <Text style={styles.text}>{content.substring(0, 300)}</Text>
                                        <Text style={[styles.text, { color: '#8c8c8c' }]}>... Xem thêm</Text>
                                    </View>
                                )
                        }
                    </TouchableNativeFeedback>
                    <Tabs
                        locked
                        tabBarUnderlineStyle={{ backgroundColor: '#2196F3' }}
                        page={this.state.activeTabIndex}
                        onChangeTab={({ i }) => {
                            this.setState({
                                activeTabIndex: i,
                                message: ''
                            })
                        }}
                        style={{ paddingBottom: 10 }}
                    >
                        <Tab
                            heading={'Comment'}
                            tabStyle={{ backgroundColor: 'white' }}
                            activeTabStyle={{ backgroundColor: 'white' }}
                            activeTextStyle={{ color: '#2196F3', fontSize: 18 }}
                            textStyle={{ color: '#808080' }}
                        >
                            {isLoading ? (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="large" animating color={AppCommon.colors} />
                                </View>
                            ) : (
                                    <FlatList
                                        data={comments}
                                        extraData={this.state.comments}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={this.renderItem}
                                        // onRefresh={this.handleRefresh}
                                        // refreshing={this.state.refreshing}
                                        onEndReached={this.handleLoadMore}
                                        onEndReachedThreshold={50}
                                    />
                                )}
                            {/* <FlatList
                                data={comments}
                                extraData={this.state.comments}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderItem}
                                // onRefresh={this.handleRefresh}
                                // refreshing={this.state.refreshing}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={50}
                            /> */}
                        </Tab>
                        <Tab
                            heading={'Note'}
                            tabStyle={{ backgroundColor: 'white' }}
                            activeTabStyle={{ backgroundColor: 'white' }}
                            activeTextStyle={{ color: '#2196F3', fontSize: 18 }}
                            textStyle={{ color: '#808080' }}
                        >
                            {isLoading ? (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="large" animating color={AppCommon.colors} />
                                </View>
                            ) : (
                                    <FlatList
                                        data={notes}
                                        extraData={this.state.notes}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={this.renderItem}
                                        // onRefresh={this.handleRefresh}
                                        // refreshing={this.state.refreshing}
                                        onEndReached={this.handleLoadMore}
                                        onEndReachedThreshold={50}
                                    />
                                )}
                            {/* <FlatList
                                data={notes}
                                extraData={this.state.notes}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.renderItem}
                                // onRefresh={this.handleRefresh}
                                // refreshing={this.state.refreshing}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={50}
                            /> */}
                        </Tab>
                    </Tabs>
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
    textView: {
        marginVertical: 15,
        paddingHorizontal: 15,
    },
    text: {
        fontSize: 20.5,
        textAlign: 'justify',
        color: '#404040',
    },
});