import RNFS from 'react-native-fs'
import { Actions } from 'react-native-router-flux';

export function createFolder(mainPath) {
    RNFS.exists(mainPath).then(function (response) {
        if (!response) {
            RNFS.mkdir(mainPath).then(function (response) {
                return true;
            }).catch(function (error) {
                return false;
            })
        }
        return true;
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

export function deleteItem(mainPath) {
    return new Promise((resolve, reject) => {
        RNFS.unlink(mainPath).then((response) => {
            console.log('Delete response: ' + response);
            resolve(response);
        }).catch((error) => {
            console.log('Delete error: ' + error);
            reject(error);
        })
    })
}

export function popWithUpdate() {
    setTimeout(() => { Actions.refresh({ refresh: true }) }, 500);
    Actions.pop();
}

export function popToMerchantWithUpdate() {
    setTimeout(() => { Actions.refresh({ refresh: true }) }, 500);
    Actions.merchant();
}