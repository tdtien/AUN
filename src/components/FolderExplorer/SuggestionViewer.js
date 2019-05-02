import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
} from 'react-native';
import {
    Text,
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

export default class SuggestionViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
        };
    }

    componentDidMount() {
        this._getAll();
    }

    detail(item, index) {
        // if (this.props.isConnected) {
        //     if (index === 0) {
        //         Actions.suggestionTypeViewer({ flow: this.props, data: this.state.data.implications, sType: 'implications', isConnected: this.props.isConnected });
        //     } else if (index === 1) {
        //         Actions.suggestionTypeViewer({ flow: this.props, data: this.state.data.questions, sType: 'questions', isConnected: this.props.isConnected });
        //     } else {
        //         Actions.suggestionTypeViewer({ flow: this.props, data: this.state.data.evidences, sType: 'evidences', isConnected: this.props.isConnected });
        //     }
        // } else {
        //     if (index === 0) {
        //         let filterData = this.state.data.filter(item => item.type === "IMPLICATION")
        //         Actions.suggestionTypeViewer({ flow: this.props, data: filterData, sType: 'implications', isConnected: this.props.isConnected });
        //     } else if (index === 1) {
        //         let filterData = this.state.data.filter(item => item.type === "QUESTION")
        //         Actions.suggestionTypeViewer({ flow: this.props, data: filterData, sType: 'questions', isConnected: this.props.isConnected });
        //     } else {
        //         let filterData = this.state.data.filter(item => item.type === "EVIDENCE")
        //         Actions.suggestionTypeViewer({ flow: this.props, data: filterData, sType: 'evidences', isConnected: this.props.isConnected });
        //     }
        // }
        var data, type;
        if (index === 0) {
            data = this.props.isConnected ? this.state.data.implications : this.state.data.filter(item => item.type === "IMPLICATION")
            type = 'implications'
        } else if (index === 1) {
            data = this.props.isConnected ? this.state.data.questions : this.state.data.filter(item => item.type === "QUESTION")
            type = 'questions'
        } else {
            data = this.props.isConnected ? this.state.data.evidences : this.state.data.filter(item => item.type === "EVIDENCE")
            type = 'evidences'
        }
        Actions.suggestionTypeViewer({
            sarInfo: this.props.sarInfo,
            criterionInfo: this.props.criterionInfo,
            subCriterionInfo: this.props.subCriterionInfo,
            suggestionInfo: item,
            flow: this.props, 
            data: data, 
            sType: type, 
            isConnected: this.props.isConnected 
        });
    }

    _getAll = () => {
        if (this.props.isConnected) {
            getAllSuggestions(this.props.token, this.props.subCriterionInfo.id)
                .then((responseJson) => {
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
            let offlineSubCriterionData = this.props.offlineSubCriterionData.find(item => item.id === this.props.subCriterionInfo.id)
            this.setState({
                isLoading: false,
                refreshing: false,
                data: offlineSubCriterionData.suggestions
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
            <SuggestionItem
                item={item}
                sType={this.props.sType}
                flow={this.props.flow}
                isConnected={this.props.isConnected}
            />
        )
    }

    render() {
        let type = this.props.sType;
        let title = '';
        if (type === "evidences") {
            title = "All evidence types";
        } else {
            title = "All " + type.charAt(0).toUpperCase() + type.slice(1);
        }
        return (
            <Container style={{ backgroundColor: AppCommon.background_color }}>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                    rounded
                >
                    <TouchableOpacity style={styles.menuButton} onPress={() => Actions.pop()} >
                        <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
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
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} disabled>
                        <Icon name="right" type="AntDesign" style={{ color: 'gray', fontSize: 15 }} />
                        <Text style={{ color: AppCommon.colors }}>{this.props.subCriterionInfo.name}</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Content
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                >
                    {
                        (this.props.data.length === 0) ? (
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
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
});