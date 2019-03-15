import React from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import {
    Header,
    Left,
    Body,
    Button,
    Title,
    Right,
} from "native-base";
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions } from "react-native-router-flux";

export default class PDFViewer extends React.Component {
    constructor(props) {
        super(props);
        console.log('File Path: ' + this.props.filePath);
    }

    render() {
        const source = {uri: this.props.filePath};

        return (
            <View style={styles.container}>
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
                        <Title style={{ alignSelf: "center" }}>{this.props.fileName}</Title>
                    </Body>
                    <TouchableOpacity style={styles.headerButton} onPress={() => null} >
                        <Icon
                            name='upload'
                            size={30}
                            color='white'
                        />
                    </TouchableOpacity>
                </Header>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        console.log(error);
                    }}
                    style={styles.pdf}/>
            </View>
        )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopWidth: 0, 
        borderBottomWidth: 0,
        backgroundColor: '#F7F5F5'
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 10
    }
});