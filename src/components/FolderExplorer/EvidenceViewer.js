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
import { getAllEvidences } from '../../api/directoryTreeApi';
import { connect } from 'react-redux';
import Loader from '../Loader/Loader'
import { Actions } from 'react-native-router-flux';
import { AppCommon } from '../../commons/commons';
import EvidenceItem from './EvidenceItem'

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

    _getAll = () => {
        getAllEvidences(this.props.token, this.props.suggestionId)
            .then((responseJson) => {
                console.log('data: ' + responseJson.data);
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

    renderItem(item, index) {
        return (
            <EvidenceItem
                item={item}
                token={this.props.token}
            />
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
                    <TouchableOpacity style={styles.menuButton} onPress={() => Actions.pop()} >
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
    }
});