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