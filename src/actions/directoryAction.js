import { SET_DIRECTORY_INFO } from './types'

type DirectoryInfo = {
    email: string,
    directoryTree: Object,
}

export const setDirectoryInfo = (info: DirectoryInfo) => {
    return {
        type: SET_DIRECTORY_INFO,
        data: info,
    };
};