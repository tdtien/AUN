import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Alert
} from 'react-native';
import {
    Content,
    Container,
    Icon,
    Header,
    Body,
    Title,
} from 'native-base';
import { getAllSubCriterions } from '../../api/directoryTreeApi';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader'
import { Actions } from 'react-native-router-flux';
import { AppCommon } from '../../commons/commons';
import FolderItem from './FolderItem'

class SubCriterionViewer extends Component {
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

    detail(subcriterionId) {
        var props = {
            sarId: this.props.sarId, 
            criterionId: this.props.criterionId, 
            subcriterionId: subcriterionId,
            isConnected: this.props.isConnected, 
            offlineSubCriterionData: this.state.data
        }
        Actions.suggestionViewer(props);
    }

    _getAll = () => {
        if (this.props.isConnected) {
            getAllSubCriterions(this.props.token, this.props.criterionId)
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
            let offlineSubCriterionData = this.props.offlineCriterionData.find(item => item.id === this.props.criterionId)
            // console.log('offineData: ' + JSON.stringify(offlineSubCriterionData.subCriterions));
            this.setState({
                isLoading: false,
                refreshing: false,
                data: offlineSubCriterionData.subCriterions
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
            <FolderItem
                item={item}
                parentView={this}
                index={index}
            />
        )
    }

    handleShowFooter = (choosenSubCriterionId) => {
       
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
                    <TouchableOpacity style={styles.menuButton} onPress={() => Actions.pop()} >
                        <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center", color: 'white' }}>All SubCriterions</Title>
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
                                    renderItem={({ item, index }) => this.renderItem(item, index)}
                                    onRefresh={this.handleRefresh}
                                    refreshing={this.state.refreshing}
                                    onEndReached={this.handleLoadMore}
                                    onEndReachedThreshold={50}
                                />
                            )
                    }
                </Content>
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

export default connect(mapStateToProps)(SubCriterionViewer);

const styles = StyleSheet.create({
    menuButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
});