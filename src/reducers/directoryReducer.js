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
            let directoryTree = action.data.directoryTree
            console.log('old state: ' + JSON.stringify(newState.directoryInfo));
            switch (action.data.downloadItemType) {
                case 'sar':
                    {
                        let index = sarArray.findIndex(item => item.id === flow.sarInfo.id);
                        if (index !== -1) {
                            sarArray[index] = directoryTree
                        } else {
                            sarArray.push(directoryTree);
                        }
                        break;
                    }
                case 'criterion':
                    {
                        let sarItem = sarArray.find(item => item.id === flow.sarInfo.id);
                        if (sarItem === undefined) {
                            sarArray.push(directoryTree);
                            break;
                        }
                        let criterionIndex = sarItem.criterions.findIndex(item => item.id === flow.criterionInfo.id);
                        let criterionItem = directoryTree.criterions[0];
                        if (criterionIndex !== -1) {
                            sarItem.criterions[criterionIndex] = criterionItem;
                        } else {
                            sarItem.criterions.push(criterionItem);
                        }
                        break;
                    }
                case 'subCriterion':
                    {
                        let sarItem = sarArray.find(item => item.id === flow.sarInfo.id);
                        if (sarItem === undefined) {
                            sarArray.push(directoryTree);
                            break;
                        }
                        let criterionItem = sarItem.criterions.find(item => item.id === flow.criterionInfo.id);
                        if (criterionItem === undefined) {
                            sarItem.criterions.push(directoryTree.criterions[0]);
                            break;
                        }
                        let subCriterionIndex = criterionItem.subCriterions.findIndex(item => item.id === flow.subCriterionInfo.id);
                        let subCriterionNewItem = directoryTree.criterions[0].subCriterions[0];
                        if (subCriterionIndex !== -1) {
                            criterionItem.subCriterions[subCriterionIndex] = subCriterionNewItem;
                        } else {
                            criterionItem.subCriterions.push(subCriterionNewItem);
                        }
                        break;
                    }
                case 'suggestionType':
                    {
                        let sarItem = sarArray.find(item => item.id === flow.sarInfo.id);
                        if (sarItem === undefined) {
                            sarArray.push(directoryTree);
                            break;
                        }
                        let criterionItem = sarItem.criterions.find(item => item.id === flow.criterionInfo.id);
                        if (criterionItem === undefined) {
                            sarItem.criterions.push(directoryTree.criterions[0]);
                            break;
                        }
                        let subCriterionIndex = criterionItem.subCriterions.findIndex(item => item.id === flow.subCriterionInfo.id);
                        let subCriterionNewItem = directoryTree.criterions[0].subCriterions[0];
                        if (subCriterionIndex !== -1) {
                            let subCriterionItem = criterionItem.subCriterions[subCriterionIndex];
                            subCriterionItem.suggestions[flow.suggestionTypeName] = subCriterionNewItem.suggestions[flow.suggestionTypeName]
                        } else {
                            criterionItem.subCriterions.push(subCriterionNewItem);
                        }
                        break;
                    }
                case 'suggestion':
                    {
                        let sarItem = sarArray.find(item => item.id === flow.sarInfo.id);
                        if (sarItem === undefined) {
                            sarArray.push(directoryTree);
                            break;
                        }
                        let criterionItem = sarItem.criterions.find(item => item.id === flow.criterionInfo.id);
                        if (criterionItem === undefined) {
                            sarItem.criterions.push(directoryTree.criterions[0]);
                            break;
                        }
                        let subCriterionItem = criterionItem.subCriterions.find(item => item.id === flow.subCriterionInfo.id);
                        if (subCriterionItem === undefined) {
                            criterionItem.subCriterions.push(directoryTree.criterions[0].subCriterions[0]);
                            break;
                        }
                        let suggestionArray = subCriterionItem.suggestions;
                        let suggestionTypeNewItem = directoryTree.criterions[0].subCriterions[0].suggestions[flow.suggestionType];
                        if (suggestionArray.hasOwnProperty(flow.suggestionType)) {
                            let suggestionIndex = suggestionArray[flow.suggestionType].findIndex(item => item.id === flow.suggestionInfo.id);
                            if (suggestionIndex !== -1) {
                                suggestionArray[flow.suggestionType][suggestionIndex] = suggestionTypeNewItem[0];
                            } else {
                                suggestionArray[flow.suggestionType].push(suggestionTypeNewItem[0]);
                            }
                        } else {
                            suggestionArray[flow.suggestionType] = suggestionTypeNewItem
                        }
                        break;
                    }
                case 'evidence':
                    {
                        let sarItem = sarArray.find(item => item.id === flow.sarInfo.id);
                        if (sarItem === undefined) {
                            sarArray.push(directoryTree);
                            break;
                        }
                        let criterionItem = sarItem.criterions.find(item => item.id === flow.criterionInfo.id);
                        if (criterionItem === undefined) {
                            sarItem.criterions.push(directoryTree.criterions[0]);
                            break;
                        }
                        let subCriterionItem = criterionItem.subCriterions.find(item => item.id === flow.subCriterionInfo.id);
                        if (subCriterionItem === undefined) {
                            criterionItem.subCriterions.push(directoryTree.criterions[0].subCriterions[0]);
                            break;
                        }
                        let evidenceTypeNewArray = directoryTree.criterions[0].subCriterions[0].suggestions.evidences;
                        if (subCriterionItem.suggestions.hasOwnProperty('evidences')) {
                            let evidenceTypeItem = subCriterionItem.suggestions.evidences.find(item => item.id === flow.suggestionInfo.id);
                            if (evidenceTypeItem === undefined) {
                                subCriterionItem.suggestions.evidences.push(evidenceTypeNewArray[0]);
                                break;
                            }
                            let evidenceIndex = evidenceTypeItem.evidences.findIndex(item => item.id === flow.evidenceInfo.id);
                            if (evidenceIndex !== -1) {
                                evidenceTypeItem.evidences[evidenceIndex] = evidenceTypeNewArray[0];
                            } else {
                                evidenceTypeItem.evidences.push(evidenceTypeNewArray[0]);
                            }
                        } else {
                            subCriterionItem.suggestions.evidences = evidenceTypeNewArray;
                        }
                        break;
                    }
                default:
                    break;
            }
            console.log('-------------------');
            console.log('new state: ' + JSON.stringify(newState.directoryInfo));
            return { ...state, newState };
            //Detach evidences file


            //reset directory redux
            // console.log('Reset redux');
            // let newState = {};
            // return newState;
        }
        default:
            return state;
    }
};

export default directoryReducer;
