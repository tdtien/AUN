import React, { Component } from 'react';
import { getAllSars } from '../../api/directoryTreeApi';
import { connect } from 'react-redux';
import FolderComponent from './FolderComponent'
import Loader from '../Loader/Loader'
import { Actions } from 'react-native-router-flux';

class SarViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        };
    }

    componentDidMount() {
        this._getAll(null, null);
    }

    detail() {
        Actions.criterionViewer();
    }


    _getAll = (prevData, childView) => {
        getAllSars(this.props.token)
            .then((responseJson) => {
                console.log('responseJson: ' + responseJson.data[0].name);
                if (prevData === null) {
                    this.setState({
                        isLoading: false,
                    })
                    Actions.folderComponent({ data: responseJson.data, rootKey: 'sar', title: 'All Sars', parentView: this });
                }
                else {
                    if (JSON.stringify(prevData) !== JSON.stringify(responseJson.data)) {
                        Actions.folderComponent({ data: responseJson.data, rootKey: 'sar', title: 'All Sars', parentView: this });
                    } else {
                        childView.handleCancelRefresh();
                    }
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false
                })
                console.error('Error: ' + error);
            });
    }

    render() {
        const key = 'sar';
        return (
            <Loader loading={this.state.isLoading} />
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.account.token,
    };
};

export default connect(mapStateToProps)(SarViewer);