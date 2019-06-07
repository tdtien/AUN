import RNFS from 'react-native-fs'
import { Actions } from 'react-native-router-flux';
import { AppCommon } from './commons';
import { validateSimpleURL } from './validation';

export function createFolder(mainPath) {
    return new Promise((resolve, reject) => {
        RNFS.exists(mainPath).then(function (response) {
            if (!response) {
                RNFS.mkdir(mainPath).then(function (response) {
                    resolve(true);
                }).catch(function (error) {
                    reject(error);
                })
            }
            else {
                resolve(true);
            }
        })
    })
}

export function fileToBase64(uri) {
    return new Promise((resolve, reject) => {
        RNFS.readFile(uri, 'base64').then((response) => {
            resolve(response);
        }).catch((error) => {
            console.log('error: ' + error);
            reject(error);
        })
    })
}

export function limitText(text, limit = 20) {
    return ((text).length > limit) ? (((text).substring(0, limit - 3)) + '...') : text
}

export async function folderToBase64(files) {
    var array = [];
    for (let item of files) {
        await fileToBase64(`file://${item.path}`)
            .then(result => {
                array.push(result);
            }).catch(error => {
                console.log('Error: ' + error);
                reject(error);
            })
    }
    return array;
}

export function checkEvidenceExistence(filePath) {
    return new Promise((resolve, reject) => {
        RNFS.exists(filePath)
            .then((response) => {
                if (response) {
                    resolve('existed');
                } else {
                    resolve('non-existence');
                }
            }).catch(error => {
                console.log('Error when checking file existence: ' + error);
                reject(false);
            })
    })
}

export function downloadEvidence(url, filePath) {
    checkEvidenceExistence(filePath)
        .then(response => {
            console.log('response: ' + JSON.stringify(response));
            if (response === 'non-existence') {
                return new Promise((resolve, reject) => {
                    RNFS.downloadFile({
                        fromUrl: url,
                        toFile: filePath,
                        connectionTimeout: 300 * 1000,
                        background: true,
                    }).promise.then(response => {
                        console.log('123');
                        resolve(true);
                    }).catch(error => {
                        console.log('Error when download evidence:' + error);
                        reject(error);
                    })
                })
            }
        }).catch(error => {
            console.log('Error when download evidence:' + error);
            reject(error);
        })

}

export function downloadAllEvidences(directoryTree, pdfFolderPath) {
    return new Promise((resolve, reject) => {
        let promises = [];
        createFolder(pdfFolderPath)
            .then(response => {
                let criterionArray = directoryTree.criterions;
                for (let criterion of criterionArray) {
                    let suggestions = criterion.suggestions;
                    if (!suggestions.hasOwnProperty('evidences')) {
                        resolve(directoryTree);
                    } else {
                        let evidenceTypeArray = suggestions.evidences;
                        for (let evidenceType of evidenceTypeArray) {
                            let evidenceArray = evidenceType.evidences;
                            for (let evidence of evidenceArray) {
                                if (evidence.type === 'FILE') {
                                    let filePath = pdfFolderPath + '/' + evidence.name + '_' + evidence.id + '.pdf';
                                    promises.push(downloadEvidence(evidence.link, filePath))
                                    evidence.link = filePath;
                                }
                            }
                        }
                    }
                }
                Promise.all(promises)
                    .then(() => {
                        console.log('Download completed');
                        resolve(directoryTree);
                    }).catch((error) => {
                        console.log('Download failed');
                        reject(error);
                    })
            }).catch(error => {
                console.log('Error when create folder: ' + error);
                reject(error);
            })
    })
}

export function deleteItem(mainPath) {
    return new Promise((resolve, reject) => {
        RNFS.unlink(mainPath).then((response) => {
            resolve(response);
        }).catch((error) => {
            console.log('Delete error: ' + error);
            reject(error);
        })
    })
}

export async function deleteMultipleItems(files) {
    for (let item of files) {
        console.log('item path: ' + item.path);
        await deleteItem(`file://${item.path}`)
            .then(result => {
                // console.log('Delete file successfully');
            })
            .catch(error => {
                // console.log('Delete file fail');
                return false;
            })
    }
    return true;
}

export function popWithUpdate(props = {}) {
    setTimeout(() => { Actions.refresh(props) }, 500);
    Actions.pop();
}

export function popToSceneWithUpdate(scene, props) {
    setTimeout(() => { Actions.refresh(props) }, 300);
    Actions.popTo(scene);
}

export function isEmptyJson(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function createDirectoryTreeWith(flow, data, type) {
    let directoryTree = {};
    switch (type) {
        case 'sar':
            directoryTree = data;
            break;
        case 'criterion':
            directoryTree = {
                id: flow.sarInfo.id,
                name: flow.sarInfo.name,
                criterions: [data],
            }
            break;
        case 'subCriterion':
            directoryTree = {
                id: flow.sarInfo.id,
                name: flow.sarInfo.name,
                criterions: [{
                    id: flow.criterionInfo.id,
                    name: flow.criterionInfo.name,
                    subCriterions: [data],
                    suggestions: {},
                }],
            }
            break;
        case 'suggestionType':
            directoryTree = {
                id: flow.sarInfo.id,
                name: flow.sarInfo.name,
                criterions: [{
                    id: flow.criterionInfo.id,
                    name: flow.criterionInfo.name,
                    subCriterions: [],
                    suggestions: data.suggestions
                }],
            }
            break;
        case 'suggestion':
            directoryTree = {
                id: flow.sarInfo.id,
                name: flow.sarInfo.name,
                criterions: [{
                    id: flow.criterionInfo.id,
                    name: flow.criterionInfo.name,
                    subCriterions: [],
                    suggestions: {
                        [flow.suggestionType]: [data]
                    }
                }],
            }
            break;
        case 'evidence':
            directoryTree = {
                id: flow.sarInfo.id,
                name: flow.sarInfo.name,
                criterions: [{
                    id: flow.criterionInfo.id,
                    name: flow.criterionInfo.name,
                    subCriterions: [],
                    suggestions: {
                        evidences: [{
                            id: flow.suggestionInfo.id,
                            content: flow.suggestionInfo.content,
                            type: flow.suggestionInfo.type,
                            evidences: [data]
                        }]
                    }
                }],
            }
            break;
        default:
            break;
    }

    //Delete evidence type = 'LINK'
    directoryTree.criterions.forEach(criterion => {
        let suggestions = criterion.suggestions;
        if (suggestions.hasOwnProperty('evidences')) {
            suggestions.evidences.forEach(evidenceType => {
                let fileEvidences = [];
                evidenceType.evidences.forEach(evidence => {
                    if (evidence.type === 'FILE') {
                        fileEvidences.push(evidence);
                    }
                })
                evidenceType.evidences = fileEvidences;
            })
        }
    });
    return directoryTree;
}

/**searchs through all arrays of the tree if the for a value from a property
 * @param aTree : the tree array
 * @param fCompair : This function will receive each node. It's upon you to define which 
                     condition is necessary for the match. It must return true if the condition is matched. Example:
                        function(oNode){ if(oNode["Name"] === "AA") return true; }
 * @param bGreedy? : use true to do not stop after the first match, default is false
 * @return an array with references to the nodes for which fCompair was true; In case no node was found an empty array
 *         will be returned
*/
export function _searchTree(aTree, fCompair, bGreedy = false) {
    var aInnerTree = []; // will contain the inner children
    var oNode; // always the current node
    var aReturnNodes = []; // the nodes array which will returned

    // 1. loop through all root nodes so we don't touch the tree structure
    for (keysTree in aTree) {
        aInnerTree.push(aTree[keysTree]);
    }
    while (aInnerTree.length > 0) {
        oNode = aInnerTree.pop();
        // check current node
        if (fCompair(oNode)) {
            aReturnNodes.push(oNode);
            if (!bGreedy) {
                return aReturnNodes;
            }
        } else { // if (node.children && node.children.length) {
            // find other objects, 1. check all properties of the node if they are arrays
            for (keysNode in oNode) {
                // true if the property is an array
                if (oNode[keysNode] instanceof Array) {
                    // 2. push all array object to aInnerTree to search in those later
                    for (var i = 0; i < oNode[keysNode].length; i++) {
                        aInnerTree.push(oNode[keysNode][i]);
                    }
                }
            }
        }
    }
    return aReturnNodes; // someone was greedy
}

export function getNextType(type = 'sars') {
    switch (type) {
        case 'sars': return 'criterions';
        case 'criterions': return 'suggestionTypes';
        case 'implications':
        case 'questions':
        case 'evidences':
        case 'subCriterions': return 'suggestions';
        case 'suggestions': return 'evidences';
        default: return '';
    }
}

export function cachePdf(id, path) {
    if (typeof (id) === 'string' && typeof (path) === 'string') {
        let item = {
            id: id,
            path: path,
        }
        AppCommon.pdf_caches.push(item);
    }
}

export function findPdfCacheItem(id) {
    let item = AppCommon.pdf_caches.find(item => item.id === id);
    return item;
}

export function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}