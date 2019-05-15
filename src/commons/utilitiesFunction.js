import RNFS from 'react-native-fs'
import { Actions } from 'react-native-router-flux';

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
    return ((text).length > 30) ? (((text).substring(0, limit - 3)) + '...') : text
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

export function downloadEvidence(url, filePath) {
    return new Promise((resolve, reject) => {
        RNFS.downloadFile({
            fromUrl: url,
            toFile: filePath,
            connectionTimeout: 60 * 1000,
            background: true,
        }).promise.then(response => {
            resolve(true);
        }).catch(error => {
            console.log('Error when download evidence:' + error);
            reject(error);
        })
    })
}

export function downloadAllEvidences(directoryTree, pdfFolderPath) {
    return new Promise((resolve, reject) => {
        let promises = [];
        createFolder(pdfFolderPath)
            .then(response => {
                let criterionArray = directoryTree.criterions;
                for (let criterion of criterionArray) {
                    let subCriterionArray = criterion.subCriterions;
                    for (let subCriterion of subCriterionArray) {
                        if (!subCriterion.suggestions.hasOwnProperty('evidences')) {
                            resolve(directoryTree);
                        } else {
                            let evidenceTypeArray = subCriterion.suggestions.evidences;
                            for (let evidenceType of evidenceTypeArray) {
                                let evidenceArray = evidenceType.evidences;
                                for (let evidence of evidenceArray) {
                                    let filePath = pdfFolderPath + '/' + evidence.name + '.pdf';
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
                    subCriterions: [{
                        id: flow.subCriterionInfo.id,
                        name: flow.subCriterionInfo.name,
                        suggestions: {
                            [flow.suggestionType]: [data]
                        }
                    }],
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
                    subCriterions: [{
                        id: flow.subCriterionInfo.id,
                        name: flow.subCriterionInfo.name,
                        suggestions: {
                            evidences: [{
                                id: flow.suggestionInfo.id,
                                content: flow.suggestionInfo.content,
                                type: flow.suggestionInfo.type,
                                evidences: [data]
                            }]
                        }
                    }],
                }],
            }
            break;
        default:
            break;
    }
    return directoryTree;
}