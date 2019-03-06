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

export default class MerchantDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: 2,
        }
    }

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
                        data={this.props.imageList}
                        renderItem={this.renderItem.bind(this)}
                        numColumns={2}
                    />
                </ScrollView>
                <TouchableOpacity style={styles.cameraButton} onPress={() => { Actions.camera() }}>
                    <Icon name={"camera"}
                        size={30}
                        color="white" />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cameraButton: {
        position: 'absolute',
        width: 80,
        height: 80,
        bottom: 20,
        right: 20,
        borderRadius: 80,
        backgroundColor: 'rgb(22,172,143)',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
