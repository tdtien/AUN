import React, { Component } from "react";
import {
    View,
    ImageBackground,
    Text,
    StyleSheet,
    TouchableHighlight,
    Alert,
    Image
} from "react-native";
import { Actions } from "react-native-router-flux";
import RNFS from 'react-native-fs'
import moment from 'moment'
import Swipeout from 'react-native-swipeout'
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';

export default class MerchantItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewImagePath: {},
            count: 0,
            date: {},
        }
    }

    handleClickItem(path) {
        Actions.merchantDetail({ folderPath: path, folderName: this.props.item.name, flow: this.props.flow })
    }

    componentDidMount() {
        this.makeRemoteRequest(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.makeRemoteRequest(nextProps);
    }

    makeRemoteRequest = (props) => {
        let path = props.item.path;
        RNFS.readDir(path)
            .then((result) => {
                if (result != undefined && result.length > 0) {
                    this.setState({
                        count: 0,
                    })
                    for (index in result) {
                        const item = result[index];
                        if (item.isFile()) {
                            if (index == 0) {
                                this.setState({
                                    previewImagePath: item.path,
                                    date: item.mtime
                                })
                            }
                            this.setState({
                                count: this.state.count + 1,
                            })
                        }

                    }
                }
            })
            .catch(err => {
                console.log('err in reading files');
                console.log(err);
            })
    };

    render() {
        const swipeSetting = {
            autoClose: true,
            // onClose: (sectionID, rowId, direction) => {

            // },
            // onOpen: (sectionID, rowId, direction) => {

            // },
            right: [
                {
                    onPress: () => {
                        Alert.alert(
                            I18n.t(keys.Merchant.MerchantItem.lblDeleteFolder),
                            I18n.t(keys.Merchant.MerchantItem.alertDeleteFolder),
                            [
                                {
                                    text: I18n.t(keys.Common.lblCancel),
                                    style: 'cancel',
                                    onPress: () => null,
                                },
                                {
                                    text: I18n.t(keys.Common.lblOK),
                                    onPress: () => { this.props.action(this.props.item) },
                                }
                            ]
                        )
                    },
                    text: I18n.t(keys.Common.lblDelete), type: 'delete'
                }
            ]
        }
        return (
            <Swipeout {...swipeSetting}>
                <TouchableHighlight onPress={() => this.handleClickItem(`file://${this.props.item.path}`)}>
                    <View style={styles.container}>
                        <Image
                            style={styles.image}
                            source={{ width: 140, height: 100, uri: `file://${this.state.previewImagePath}?ver=${this.props.version}`, cache: 'reload' }}
                        />
                        <View style={styles.information}>
                            <Text style={styles.title}>{this.props.item.name}</Text>
                            <View style={styles.subTitle}>
                                <Text style={styles.subText}>{moment(this.state.date).format('DD/MM/YYYY HH:mm')}</Text>
                                <View style={styles.badgeCount}>
                                    <Text style={styles.badgeText}>{this.state.count}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            </Swipeout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        position: "relative",
        backgroundColor: "white",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ECE9E9'
    },
    image: {
        width: 140,
        height: 100,
        padding: 0
    },
    information: {
        flex: 1,
        flexDirection: 'column',
        paddingLeft: 20
    },
    title: {
        fontSize: 20,
        color: 'black',
        paddingTop: 2
    },
    subTitle: {
        flex: 1,
        flexDirection: 'row',
    },
    subText: {
        paddingRight: 10,
        paddingTop: 7,
        fontSize: 15
    },
    badgeCount: {
        borderRadius: 3,
        height: 16,
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 9,
    },
    badgeText: {
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 10
    }
});
