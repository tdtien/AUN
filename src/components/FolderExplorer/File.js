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
import { AppCommon } from '../../commons/commons';
import { Actions } from 'react-native-router-flux';

var data = [
    {
        "id": 1,
        "name": "Nội hàm"
    },
    {
        "id": 2,
        "name": "Câu hỏi chẩn đoán"
    },
    {
        "id": 3,
        "name": "Nguồn minh chứng"
    }
]

export default class File extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            // data: [],
            // error: null,
            refreshing: false,
            // searchText: "",
            // isEnd: false,
            // isSearching: false,
            // version: Math.random(),
            // dataFilter: []
        };
    }

    renderItem({ item }) {
        let iconName = (item.id === 3) ? 'folder1' : 'filetext1'
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => null}>
                <View style={styles.item}>
                    <View style={styles.leftItem}>
                        <Icon name={iconName} type="AntDesign" style={{ color: 'deepskyblue', fontSize: AppCommon.icon_largeSize }} />
                        <Text style={{ color: 'black', paddingHorizontal: 20, fontSize: 20 }}>{item.name}</Text>
                    </View>
                    <Icon name='angle-right' type="FontAwesome5" style={{ color: 'gray', fontSize: AppCommon.icon_size }} />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <Container style={{ backgroundColor:  AppCommon.background_color }}>
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                    rounded
                >
                    <TouchableOpacity style={styles.menuButton} onPress={() => Actions.drawerOpen()} >
                        <Icon name={AppCommon.icon("menu")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center", color: 'white' }}>All Docs</Title>
                    </Body>
                    <TouchableOpacity style={styles.menuButton} onPress={() => this.handleSearchPressed()} >
                        <Icon name={AppCommon.icon("search")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                </Header>
                <Content
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flex: 1 }}
                >
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem.bind(this)}
                        onRefresh={this.handleRefresh}
                        refreshing={this.state.refreshing}
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={50}
                    />
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
        justifyContent: 'flex-start'
    }
});