import RNFS from 'react-native-fs'

export function createFolder(mainPath) {
    RNFS.exists(mainPath).then(function(response) {
        if (!response)
        {
            RNFS.mkdir(mainPath).then(function(response) {
                return true;
            }).catch(function(error) {
                return false;
            })
        }
        return true;
    })
}

export function fileToBase64(uri) {
    console.log('uri: ' + uri);
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
                // console.log('Result: ' + result);
                array.push(result);
            }).catch(error => {
                console.log('Error: ' + error);
                reject(error);
            })
    }
    return array;
}