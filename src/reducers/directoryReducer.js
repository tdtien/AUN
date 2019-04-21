import { SET_DIRECTORY_INFO } from "../actions/types";

const initialState = {
    directoryInfo: {}
};

const directoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DIRECTORY_INFO: {
            //chua xet dk trung
            let newState = state;
            newState.directoryInfo[action.data.email] = action.data.directoryTree;
            console.log('new state: ' + JSON.stringify(newState.directoryInfo));
            return newState;
        }
        default:
            return state;
    }
};

export default directoryReducer;
