import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
    Text,
    ImageBackground,
    ActivityIndicator
} from "react-native";
import {
    Header,
    Icon,
    Body,
    Title,
    Right,
    Footer,
    Container,
    Content,
    CheckBox
} from "native-base";
import { Actions } from "react-native-router-flux";
import { AppCommon } from "../../commons/commons";
import RNFS from "react-native-fs";
import { connect } from 'react-redux'
import {
    popWithUpdate,
    deleteItem,
    deleteMultipleItems,
    popToSceneWithUpdate,
    getTextsFromUploadFlow
} from "../../commons/utilitiesFunction";
import Loader from '../Loader/Loader'
import CameraButton from "./CameraButton";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { FlatGrid } from "react-native-super-grid";
import BreadCrumb from "../Breadcrumb/Breadcrumb";
import I18n from '../../i18n/i18n';
import keys from '../../i18n/keys';

const screenWidth = Dimensions.get('window').width;
const columns = 2;
const imageMargin = 10;
const imageWidth = (screenWidth - imageMargin * 4) / columns;
const imageHeight = imageWidth * 1.4;
class MerchantDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false,
            refreshing: false,
            byteArray: {},
            isCheckBoxVisible: false,
            selectedCheckList: [],
            isSelectAll: false,
            version: Math.random(),
            initVersion: 0
        }
    }

    componentDidMount() {
        this.makeRemoteRequest();
        this.setState({ initVersion: this.state.version })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('version')) {
            this.setState({ version: nextProps.version })
        }
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

    handlePop = () => {
        if (this.state.initVersion !== this.state.version) {
            popWithUpdate({ version: this.state.version })
        } else {
            popWithUpdate();
        }
    }

    handleImageModal = (item) => {
        this.setState({ isLoading: true })
        var dataProps = [];
        for (var i = 0; i < this.state.data.length; i++) {
            dataProps.push({ url: `file://${this.state.data[i].path}?ver=${this.state.version}` });
        }
        var props = { images: dataProps, index: this.state.data.indexOf(item), mode: "edit", folderPath: this.props.folderPath };
        this.setState({ isLoading: false })
        Actions.imageModal(props);
    }

    handleSelectMultipleImages = () => {
        this.setState({
            isCheckBoxVisible: !this.state.isCheckBoxVisible,
            selectedCheckList: []
        })
    }

    handleDeleteMultipleImages = () => {
        Alert.alert(
            I18n.t(keys.Merchant.MerchantDetail.lblDeleteImages),
            I18n.t(keys.Merchant.MerchantDetail.alertDeleteImages),
            [
                {
                    text: I18n.t(keys.Common.lblCancel),
                    style: "cancel",
                    onPress: () => null,
                },
                {
                    text: I18n.t(keys.Common.lblOK),
                    onPress: () => {
                        this.setState({
                            isLoading: true
                        })
                        let deletedItems = this.state.selectedCheckList;
                        deleteMultipleItems(deletedItems)
                            .then(result => {
                                if (this.state.data.length === deletedItems.length) {
                                    console.log('Folder empty');
                                    deleteItem(this.props.folderPath).then(result => {
                                        console.log('Delete original folder success');
                                        popToSceneWithUpdate('merchant');
                                    })
                                } else {
                                    this.setState({
                                        isLoading: false,
                                        isCheckBoxVisible: false
                                    });
                                    this.makeRemoteRequest()
                                }
                            }).catch(error => {
                                this.setState({
                                    isLoading: false,
                                });
                                Alert.alert(I18n.t(keys.Common.lblError), error.message);
                            })
                    },
                }
            ]);
    }

    handleDeselectCheckbox = () => {
        this.setState({
            isCheckBoxVisible: false
        })
    }

    handleCheckBoxPressed = (item) => {
        let temp = this.state.selectedCheckList;
        if (temp.includes(item)) {
            temp.splice(temp.indexOf(item), 1);
        } else {
            temp.push(item);
        }
        if (temp.length === this.state.data.length) {
            this.setState({
                selectedCheckList: temp,
                isSelectAll: true
            });
        } else {
            this.setState({
                selectedCheckList: temp,
                isSelectAll: false
            });
        }

    }

    handleCheckAllCheckbox = () => {
        if (!this.state.isSelectAll) {
            let temp = [];
            for (let item of this.state.data) {
                console.log('item: ' + item);
                temp.push(item);
            }
            console.log('temp: ' + temp);
            this.setState({
                selectedCheckList: temp,
                isSelectAll: true
            })
        } else {
            this.setState({
                selectedCheckList: [],
                isSelectAll: false
            })
        }
    }

    renderItem({ item, index }) {
        let checked = this.state.selectedCheckList.includes(item);
        return (this.state.isCheckBoxVisible) ? (
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.handleCheckBoxPressed(item)}>
                <ImageBackground
                    style={{ width: imageWidth, height: imageHeight }}
                    source={{ width: imageWidth, height: imageHeight, uri: `file://${item.path}?ver=${this.state.version}`, cache: "reload" }}
                >
                    <CheckBox
                        style={{ margin: 0, padding: 0, marginTop: 10 }}
                        checked={checked}
                        onPress={() => this.handleCheckBoxPressed(item)}
                    />
                </ImageBackground>
            </TouchableOpacity>
        ) : (
                <TouchableOpacity activeOpacity={0.8} onPress={() => this.handleImageModal(item)} onLongPress={() => this.handleSelectMultipleImages()}>
                    <ImageBackground
                        style={{ width: imageWidth, height: imageHeight, flex: 1, justifyContent: "flex-end" }}
                        source={{ width: imageWidth, height: imageHeight, uri: `file://${item.path}?ver=${this.state.version}`, cache: "reload" }}
                    >
                        <View style={{ backgroundColor: 'rgba(204, 204, 204, 0.5)' }}>
                            <Text style={{ color: 'white', padding: 5 }}>{index + 1}</Text>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            )
    }

    processData = () => {
        var dataProp = {};
        let exportData = (this.state.isCheckBoxVisible) ? this.state.selectedCheckList : this.state.data;
        for (var i = 0; i < exportData.length; i++) {
            dataProp[i] = {
                image: `file://${this.state.data[i].path}?ver=${this.state.version}`,
                item: this.state.data[i]
            }
        }
        return dataProp;
    }

    handlePopTo = (index, isRoot = false) => {
        let sceneKey = '';
        if (isRoot) {
            sceneKey = '_sarExplorer';
        } else {
            sceneKey = AppCommon.uploadFlow[index].scene;
        }
        Actions.popTo(sceneKey);
    }

    render() {
        let uploadFlow = getTextsFromUploadFlow();
        let selectImageTitle = (!this.state.isSelectAll) ? I18n.t(keys.Merchant.MerchantDetail.btnSelectAll) : I18n.t(keys.Merchant.MerchantDetail.btnDeselectAll);
        let isDisable = this.state.selectedCheckList.length === 0;
        let header = (!this.state.isCheckBoxVisible) ? (
            <Header
                androidStatusBarColor={AppCommon.colors}
                iosBarStyle="light-content"
                style={{ backgroundColor: AppCommon.colors }}
            >
                <TouchableOpacity style={styles.headerButton} onPress={() => this.handlePop()} >
                    <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                </TouchableOpacity>
                <Body style={{ flex: 1 }}>
                    <Title style={{ alignSelf: "center", marginRight: 15, color: 'white' }}>{this.props.folderName}</Title>
                </Body>
                <TouchableOpacity style={styles.headerButton} onPress={() => Actions.sortList({ data: this.processData(), folderName: this.props.folderName, folderPath: this.props.folderPath, flow: this.props.flow })} >
                    <Icon name="sort" type="MaterialCommunityIcons" style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                </TouchableOpacity>
                <View style={styles.headerMoreButton}>
                    <Menu>
                        <MenuTrigger customStyles={triggerStyles}>
                            <Icon name={AppCommon.icon("more")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={() => this.handleSelectMultipleImages()}>
                                <View style={styles.popupItem}>
                                    <Icon name={AppCommon.icon("checkbox")} style={{ color: AppCommon.colors, fontSize: AppCommon.icon_size }} />
                                    <Text style={styles.popupItemText}>{I18n.t(keys.Merchant.MerchantDetail.btnSelect)}</Text>
                                </View>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>
            </Header>
        ) : (
                <Header
                    androidStatusBarColor={AppCommon.colors}
                    iosBarStyle="light-content"
                    style={{ backgroundColor: AppCommon.colors }}
                >
                    <TouchableOpacity style={styles.headerButton} onPress={() => this.handleDeselectCheckbox()} >
                        <Icon name={AppCommon.icon("arrow-back")} style={{ color: 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                    <Body style={{ flex: 1 }}>
                        <Title style={{ alignSelf: "center", color: 'white' }}>{`${this.state.selectedCheckList.length} ${I18n.t(keys.Merchant.MerchantDetail.lblSelected)}`}</Title>
                    </Body>
                    <TouchableOpacity disabled={isDisable} style={styles.headerButton} onPress={() => Actions.sortList({ data: this.processData(), folderName: this.props.folderName, folderPath: this.props.folderPath, flow: this.props.flow })} >
                        <Icon name="sort" type="MaterialCommunityIcons" style={{ color: isDisable ? '#bfbfbf' : 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                    <TouchableOpacity disabled={isDisable} style={styles.headerButton} onPress={() => isDisable ? null : this.handleDeleteMultipleImages()} >
                        <Icon name={AppCommon.icon("trash")} style={{ color: isDisable ? '#bfbfbf' : 'white', fontSize: AppCommon.icon_size }} />
                    </TouchableOpacity>
                </Header>
            )
        let footer = (this.state.isCheckBoxVisible) ?
            (
                <Footer
                    style={{ backgroundColor: AppCommon.colors }}
                >
                    <Right>
                        <View style={styles.footerButton}>
                            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => this.handleCheckAllCheckbox()} >
                                <Text style={{ fontSize: 20, color: '#fff' }}>{selectImageTitle}</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity disabled={isDisable} style={{ marginLeft: 20 }} onPress={() => isDisable ? null : Actions.sortList({ data: this.processData(), folderName: this.props.folderName, folderPath: this.props.folderPath, flow: this.props.flow })} >
                                <Icon name="sort" type="MaterialCommunityIcons" style={{ color: isDisable ? '#bfbfbf' : 'white', fontSize: AppCommon.icon_size }} />
                            </TouchableOpacity>
                            <TouchableOpacity disabled={isDisable} style={{ marginLeft: 20 }} onPress={() => isDisable ? null : this.handleDeleteMultipleImages()} >
                                <Icon name={AppCommon.icon("trash")} style={{ color: isDisable ? '#bfbfbf' : 'white', fontSize: AppCommon.icon_size }} />
                            </TouchableOpacity> */}
                        </View>
                    </Right>
                </Footer>
            ) : (
                <CameraButton
                    folderPath={this.props.folderPath}
                />
            )
        return (
            <Container>
                {header}
                <BreadCrumb
                    isConnected={false}
                    handlePress={this.handlePopTo}
                    previousItem={uploadFlow.slice(0, 1)}
                    currentItem={uploadFlow[1]}
                    nextItem={uploadFlow.slice(2, uploadFlow.length)}
                />
                <Content>
                    <FlatGrid
                        style={{ marginTop: 10, flex: 1 }}
                        itemDimension={imageWidth}
                        fixed
                        items={this.state.data}
                        renderItem={this.renderItem.bind(this)}
                        onRefresh={this.handleRefresh}
                        refreshing={this.state.refreshing}
                    />
                </Content>
                {footer}
                <Loader loading={this.state.isLoading} />
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.account.token,
    };
};

export default connect(mapStateToProps)(MerchantDetail);

const triggerStyles = {
    triggerWrapper: {
        padding: 10,
    },
    TriggerTouchableComponent: TouchableOpacity,
};

const styles = StyleSheet.create({
    headerMoreButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    footerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        marginRight: 20
    },
    popupItem: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    popupItemText: {
        paddingLeft: 25,
        fontSize: 17,
        color: '#2F4F4F'
    }
});
