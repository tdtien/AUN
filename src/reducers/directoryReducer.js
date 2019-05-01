import { SET_DIRECTORY_INFO } from "../actions/types";

const initialState = {
    directoryInfo: {}
};

const directoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DIRECTORY_INFO: {
            let newState = state;
            //Check if there is no directory info in redux 
            if (Object.keys(newState.directoryInfo).length === 0) {
                console.log('Object is empty');
                newState.directoryInfo[action.data.email] = [action.data.directoryTree];
                console.log('new state: ' + JSON.stringify(newState.directoryInfo));
                return { ...state, newState };
            }

            let flow = action.data.downloadFlow;
            let sarArray = newState.directoryInfo[action.data.email];
            switch (action.data.downloadItemType) {
                case 'sar':
                    console.log('old state: ' + JSON.stringify(newState.directoryInfo));
                    let index = sarArray.findIndex(item => item.id === flow.sarInfo.id);
                    if (index !== -1) {
                        sarArray[index] = action.data.directoryTree
                    } else {
                        sarArray.push(action.data.directoryTree);
                    }
                    console.log('-------------------');
                    console.log('new state: ' + JSON.stringify(newState.directoryInfo));
                    break;
                case 'criterion':
                    console.log('old state: ' + JSON.stringify(newState.directoryInfo));
                    let sarItem = sarArray.find(item => item.id === flow.sarInfo.id);
                    if (sarItem === undefined) {
                        sarArray.push(action.data.directoryTree);
                    } else {
                        let criterionIndex = sarItem.criterions.findIndex(item => item.id === flow.criterionInfo.id);
                        let criterionItem = action.data.directoryTree.criterions[0];
                        if (criterionIndex !== -1) {
                            sarItem.criterions[criterionIndex] = criterionItem;
                        } else {
                            sarItem.criterions.push(criterionItem);
                        }
                    }
                    console.log('-------------------');
                    console.log('new state: ' + JSON.stringify(newState.directoryInfo));
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
