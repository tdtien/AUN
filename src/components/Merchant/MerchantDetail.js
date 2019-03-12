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

    renderItem({ item }) {
        return (
            <MerchantDetailItem
                item={item}
                columns={this.state.columns}
            />
        );
    }

    render() {
        const { columns } = this.state.columns;
        return (
            <View style={{ borderTopWidth: 0, borderBottomWidth: 0, flex: 1, backgroundColor: '#F7F5F5' }}>
                <Header
                    androidStatusBarColor="#2196F3"
                    style={{ backgroundColor: "#2196F3" }}
                    hasTabs
                >
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => Actions.pop()}>
                            <Icon name="chevron-left" color="#fff" size={25} />
                        </Button>
                    </Left>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center" }}>Detail</Title>
                    </Body>
                    <Right style={{ flex: 1 }} />
                </Header>
                <ScrollView>
                    <FlatList
                        data={this.state.data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem.bind(this)}
                        numColumns={2}
                    />
                </ScrollView>
                <TouchableOpacity style={merchantStyles.cameraButton} onPress={() => { Actions.camera({directory: this.props.folderPath}) }}>
                    <Icon name={"camera"}
                        size={30}
                        color="white" />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
});
