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
            // console.log('flow: ' + JSON.stringify(flow));
            let directoryTree = action.data.directoryTree
            console.log('old state: ' + JSON.stringify(newState.directoryInfo));
            switch (action.data.downloadItemType) {
                case 'sarVersion':
                    {
                        let sarItem = sarArray.find(item => item.id === flow.sarInfo.id);
                        if (sarItem === undefined) {
                            sarArray.push(directoryTree);
                            break;
                        } 
                        let sarVersionIndex = sarItem.versions.findIndex(item => item.id === flow.sarVersion.id);
                        let newSarVersion = directoryTree.versions[0];
                        if (sarVersionIndex !== -1) {
                            sarItem.versions[sarVersionIndex] = newSarVersion;
                        } else {
                            sarItem.versions.push(newSarVersion);
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
                        let sarVersionItem = sarItem.versions.find(item => item.id === flow.sarVersion.id);
                        if (sarVersionItem === undefined) {
                            sarItem.versions.push(directoryTree.versions[0]);
                            break;
                        }
                        let criterionIndex = sarVersionItem.criterions.findIndex(item => item.id === flow.criterionInfo.id);
                        let newCriterion = directoryTree.versions[0].criterions[0];
                        if (criterionIndex !== -1) {
                            sarVersionItem.criterions[criterionIndex] = newCriterion;
                        } else {
                            sarVersionItem.criterions.push(newCriterion);
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
                        let sarVersionItem = sarItem.versions.find(item => item.id === flow.sarVersion.id);
                        if (sarVersionItem === undefined) {
                            sarItem.versions.push(directoryTree.versions[0]);
                            break;
                        }
                        let criterionItem = sarVersionItem.criterions.find(item => item.id === flow.criterionInfo.id);
                        if (criterionItem === undefined) {
                            sarVersionItem.criterions.push(directoryTree.versions[0].criterions[0]);
                            break;
                        }
                        let subCriterionIndex = criterionItem.subCriterions.findIndex(item => item.id === flow.subCriterionInfo.id);
                        let newSubCriterionItem = directoryTree.versions[0].criterions[0].subCriterions[0];
                        if (subCriterionIndex !== -1) {
                            criterionItem.subCriterions[subCriterionIndex] = newSubCriterionItem;
                        } else {
                            criterionItem.subCriterions.push(newSubCriterionItem);
                        }
                        break;
                        //Error
                    }
                case 'suggestionType':
                    {
                        let sarItem = sarArray.find(item => item.id === flow.sarInfo.id);
                        if (sarItem === undefined) {
                            sarArray.push(directoryTree);
                            break;
                        }
                        let sarVersionItem = sarItem.versions.find(item => item.id === flow.sarVersion.id);
                        if (sarVersionItem === undefined) {
                            sarItem.versions.push(directoryTree.versions[0]);
                            break;
                        }
                        let criterionItem = sarVersionItem.criterions.find(item => item.id === flow.criterionInfo.id);
                        if (criterionItem === undefined) {
                            sarVersionItem.criterions.push(directoryTree.versions[0].criterions[0]);
                            break;
                        }
                        let newSuggestionTypeItem = directoryTree.versions[0].criterions[0].suggestions[flow.suggestionType];
                        criterionItem.suggestions[flow.suggestionType] = newSuggestionTypeItem;
                        break;
                    }
                case 'suggestion':
                    {
                        let sarItem = sarArray.find(item => item.id === flow.sarInfo.id);
                        if (sarItem === undefined) {
                            sarArray.push(directoryTree);
                            break;
                        }
                        let sarVersionItem = sarItem.versions.find(item => item.id === flow.sarVersion.id);
                        if (sarVersionItem === undefined) {
                            sarItem.versions.push(directoryTree.versions[0]);
                            break;
                        }
                        let criterionItem = sarVersionItem.criterions.find(item => item.id === flow.criterionInfo.id);
                        if (criterionItem === undefined) {
                            sarVersionItem.criterions.push(directoryTree.versions[0].criterions[0]);
                            break;
                        }
                        let suggestions = criterionItem.suggestions;
                        let newSuggestionTypeItem = directoryTree.versions[0].criterions[0].suggestions[flow.suggestionType];
                        if (suggestions.hasOwnProperty(flow.suggestionType)) {
                            let suggestionIndex = suggestions[flow.suggestionType].findIndex(item => item.id === flow.suggestionInfo.id);
                            if (suggestionIndex !== -1) {
                                suggestions[flow.suggestionType][suggestionIndex] = newSuggestionTypeItem[0];
                            } else {
                                suggestions[flow.suggestionType].push(newSuggestionTypeItem[0]);
                            }
                        } else {
                            suggestions[flow.suggestionType] = newSuggestionTypeItem;
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
                        let sarVersionItem = sarItem.versions.find(item => item.id === flow.sarVersion.id);
                        if (sarVersionItem === undefined) {
                            sarItem.versions.push(directoryTree.versions[0]);
                            break;
                        }
                        let criterionItem = sarVersionItem.criterions.find(item => item.id === flow.criterionInfo.id);
                        if (criterionItem === undefined) {
                            sarVersionItem.criterions.push(directoryTree.versions[0].criterions[0]);
                            break;
                        }
                        let suggestions = criterionItem.suggestions;
                        let newEvidenceTypeArray = directoryTree.versions[0].criterions[0].suggestions.evidences;
                        if (newEvidenceTypeArray[0].evidences.length === 0) {
                            break;
                        }
                        if (suggestions.hasOwnProperty('evidences')) {
                            let evidenceTypeItem = suggestions.evidences.find(item => item.id === flow.suggestionInfo.id);
                            if (evidenceTypeItem === undefined) {
                                suggestions.evidences.push(newEvidenceTypeArray[0]);
                                break;
                            }
                            let evidenceIndex = evidenceTypeItem.evidences.findIndex(item => item.id === flow.evidenceInfo.id);
                            if (evidenceIndex !== -1) {
                                evidenceTypeItem.evidences[evidenceIndex] = newEvidenceTypeArray[0].evidences[0];
                            } else {
                                evidenceTypeItem.evidences.push(newEvidenceTypeArray[0].evidences[0]);
                            }
                        } else {
                            suggestions.evidences = newEvidenceTypeArray;
                        }
                        break;
                    }
                default:
                    break;
            }
            console.log('-------------------');
            console.log('new state: ' + JSON.stringify(newState.directoryInfo));
            return { ...state, newState };

            
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
