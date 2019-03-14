import React, { Component } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert, Dimensions, ScrollView, TouchableOpacity
} from "react-native";
import {
    Header,
    Left,
    Body,
    Button,
    Title,
    Right,
} from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions } from "react-native-router-flux";
import MerchantDetailItem from "./MerchantDetailItem";
import { merchantStyles } from "./MerchantStyle";
import { AppCommon } from "../../commons/commons";
import RNFS from "react-native-fs";

export default class MerchantDetail extends Component {
    constructor(props) {
        super(props);
        console.log('Path: ' + this.props.folderPath);
        this.state = {
            data: [],
            columns: 2,
            isLoading: false,
            refreshing: false,
        }
    }

    componentDidMount() {
        this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
        let path = this.props.folderPath;
        RNFS.readDir(path)
            .then((result) => {
                const files = [];
                if (result != undefined && result.length > 0) {
                    for (index in result) {
                        const item = result[index];
                        if (item.isFile()) {
                            files.push(item);
                        }
                    }
                    if (files.length > 0) {
                        this.setState({
                            data: files,
                            isLoading: false,
                            refreshing: false,
                        })
                    }
                    else {
                        this.setState({
                            data: [],
                            isLoading: false,
                            refreshing: false,
                        })
                    }
                }
                else {
                    this.setState({
                        data: [],
                        isLoading: false,
                        refreshing: false,
                    })
                }
            })
            .catch(err => {
                console.log('err in reading files');
                console.log(err);
                this.setState({
                    data: [],
                    isLoading: false,
                    refreshing: false,
                })
            })
    };

    handleRefresh = () => {
        this.setState(
            {
                refreshing: true
            },
            () => {
                this.makeRemoteRequest();
            }
        );
    };

    renderItem({ item }) {
        return (
            <MerchantDetailItem
                item={item}
                columns={this.state.columns}
            />
        );
    }

    render() {
        return (
            <View style={{ borderTopWidth: 0, borderBottomWidth: 0, flex: 1, backgroundColor: '#F7F5F5' }}>
                <Header
                    androidStatusBarColor="#2196F3"
                    style={{ backgroundColor: "#2196F3" }}
                    hasTabs
                >
                    <TouchableOpacity style={styles.headerButton} onPress={() => Actions.pop()} >
                        <Icon
                            name='chevron-left'
                            size={25}
                            color='white'
                        />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center" }}>{this.props.folderName}</Title>
                    </Body>
                    <TouchableOpacity style={styles.headerButton} onPress={() => null} >
                        <Icon
                            name='file-pdf-o'
                            size={30}
                            color='white'
                        />
                    </TouchableOpacity>
                </Header>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem.bind(this)}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    numColumns={this.state.columns}
                />
                <TouchableOpacity style={merchantStyles.cameraButton} onPress={() => { Actions.camera({ directory: this.props.folderPath }) }}>
                    <Icon name={"camera"}
                        size={25}
                        color="white" />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 10
    }
});
