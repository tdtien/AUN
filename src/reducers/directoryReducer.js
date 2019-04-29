import { SET_DIRECTORY_INFO } from "../actions/types";

const initialState = {
    directoryInfo: {}
};

const directoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DIRECTORY_INFO: {
            let newState = state;
            //Check if there is no directory info in redux (sar directory, criterion directory)
            // if (Object.keys(newState.directoryInfo).length === 0) {
            //     console.log('Object is empty');
            //     newState.directoryInfo[action.data.email] = [action.data.directoryTree];
            //     console.log('new state: ' + JSON.stringify(newState.directoryInfo));
            //     return newState;
            // }

            switch (action.data.downloadItemType) {
                case 'sar':
                    if (Object.keys(newState.directoryInfo).length === 0) {
                        console.log('Object is empty');
                        newState.directoryInfo[action.data.email] = [action.data.directoryTree];
                        console.log('new state: ' + JSON.stringify(newState.directoryInfo));
                        return newState;
                    } else {
                        console.log('old state: ' + JSON.stringify(newState.directoryInfo));
                        let index = newState.directoryInfo[action.data.email].findIndex(item => item.id == action.data.downloadFlow.sarInfo.sarId);
                        if (index !== -1) {
                            newState.directoryInfo[action.data.email][index] = action.data.directoryTree
                        } else {
                            newState.directoryInfo[action.data.email].push(action.data.directoryTree);
                        }
                        console.log('-------------------');
                        console.log('new state: ' + JSON.stringify(newState.directoryInfo));
                    }
                    break;
                case 'criterion':
                    break;
                default:
                    break;
            }

            return { ...state, newState };
            //Detach evidences file


            //reset directory redux
            // let newState = {};
            // return newState;
        }
        default:
            return state;
    }
};

export default directoryReducer;
