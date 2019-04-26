import { SET_DIRECTORY_INFO } from "../actions/types";

const initialState = {
    directoryInfo: {}
};

const directoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DIRECTORY_INFO: {
            //chua xet dk trung
            let newState = state;
            console.log('old state: ' + JSON.stringify(newState.directoryInfo));
            newState.directoryInfo[action.data.email] = action.data.directoryTree;
            console.log('-------------------');
            console.log('new state: ' + JSON.stringify(newState.directoryInfo));
            return {...state, newState};

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
